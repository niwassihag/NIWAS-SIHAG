#!/bin/bash
set -e

echo "=== Building NIWAS Android APK with Permanent Storage ==="

ROOT_DIR="$(pwd)"
BUILD_DIR="/tmp/niwas_apk_build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/src/com/niwas/register"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/mipmap-mdpi"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxxhdpi"
mkdir -p "$BUILD_DIR/assets/www"
mkdir -p "$BUILD_DIR/obj"
mkdir -p "$BUILD_DIR/dex"
mkdir -p "$ROOT_DIR/public"

# 1. Ensure build tools exist
if [ ! -f /opt/android-build/android.jar ] || [ ! -f /opt/android-build/r8.jar ]; then
  echo "Installing Android SDK Jar and R8 compiler..."
  mkdir -p /opt/android-build
  [ -f /opt/android-build/android.jar ] || curl -sL https://raw.githubusercontent.com/Sable/android-platforms/master/android-30/android.jar -o /opt/android-build/android.jar
  [ -f /opt/android-build/r8.jar ] || curl -sL https://dl.google.com/dl/android/maven2/com/android/tools/r8/8.2.33/r8-8.2.33.jar -o /opt/android-build/r8.jar
fi

# 2. Build Web application assets directly from source
echo "Compiling latest web application assets via Vite..."
rm -rf "$ROOT_DIR/dist"
npx vite build --base=./

echo "Copying web distribution to Android assets..."
cp -r "$ROOT_DIR/dist/"* "$BUILD_DIR/assets/www/"

# Clean out any accidental nested apk files from assets
rm -f "$BUILD_DIR/assets/www/"*.apk "$BUILD_DIR/assets/www/"*.idsig

# 3. Create AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.niwas.register"
    android:versionCode="4"
    android:versionName="1.3.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:hardwareAccelerated="true"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.NoTitleBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 4. Create strings.xml
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">NIWAS</string>
</resources>
EOF

# 5. Generate all required Android launcher icon sizes from NIWAS app icon
echo "Generating crisp Android launcher mipmap icons from NIWAS icon asset..."
ICON_SRC="$ROOT_DIR/public/app-icon.png"

for pair in "mipmap-mdpi:48" "mipmap-hdpi:72" "mipmap-xhdpi:96" "mipmap-xxhdpi:144" "mipmap-xxxhdpi:192"; do
  dir="${pair%%:*}"
  size="${pair##*:}"
  r=$((size / 2))
  mkdir -p "$BUILD_DIR/res/$dir"
  # Standard square/adaptive launcher icon
  convert "$ICON_SRC" -resize "${size}x${size}" "$BUILD_DIR/res/$dir/ic_launcher.png"
  # Circular launcher round icon
  convert "$BUILD_DIR/res/$dir/ic_launcher.png" \
    \( +clone -alpha extract -draw "fill black polygon 0,0 0,$size $size,$size $size,0 fill white circle $r,$r $r,0" \) \
    -alpha off -compose CopyOpacity -composite \
    "$BUILD_DIR/res/$dir/ic_launcher_round.png"
  echo "  - Generated $dir: ${size}x${size} (square & round)"
done

# 6. Generate MainActivity.java with Embedded Local Asset Server & Permanent SharedPreferences Bridge
cat << 'EOF' > "$BUILD_DIR/src/com/niwas/register/MainActivity.java"
package com.niwas.register;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ConsoleMessage;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
import android.util.Log;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.InetAddress;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String TAG = "NIWAS_APP";
    private WebView webView;
    private AssetServer server;

    public static class StorageBridge {
        private final SharedPreferences prefs;

        public StorageBridge(Context context) {
            this.prefs = context.getSharedPreferences("niwas_permanent_storage", Context.MODE_PRIVATE);
            // Backward-compatibility: auto-migrate any previous ssc_cgl_permanent_storage
            try {
                SharedPreferences oldPrefs = context.getSharedPreferences("ssc_cgl_permanent_storage", Context.MODE_PRIVATE);
                if (oldPrefs != null && !oldPrefs.getAll().isEmpty()) {
                    SharedPreferences.Editor editor = this.prefs.edit();
                    for (Map.Entry<String, ?> entry : oldPrefs.getAll().entrySet()) {
                        if (!this.prefs.contains(entry.getKey()) && entry.getValue() instanceof String) {
                            editor.putString(entry.getKey(), (String) entry.getValue());
                        }
                    }
                    editor.apply();
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public String getItem(String key) {
            try {
                return prefs.getString(key, null);
            } catch (Exception e) {
                Log.e(TAG, "StorageBridge getItem error: " + key, e);
                return null;
            }
        }

        @JavascriptInterface
        public void setItem(String key, String value) {
            try {
                prefs.edit().putString(key, value).apply();
            } catch (Exception e) {
                Log.e(TAG, "StorageBridge setItem error: " + key, e);
            }
        }

        @JavascriptInterface
        public void removeItem(String key) {
            try {
                prefs.edit().remove(key).apply();
            } catch (Exception e) {
                Log.e(TAG, "StorageBridge removeItem error: " + key, e);
            }
        }

        @JavascriptInterface
        public void clear() {
            try {
                prefs.edit().clear().apply();
            } catch (Exception e) {
                Log.e(TAG, "StorageBridge clear error", e);
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Customize status bar color to match SSC CGL Navy brand (#1A237E)
        Window window = getWindow();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#1A237E"));
        }

        webView = new WebView(this);
        setContentView(webView);

        // Configure persistent WebView storage and features
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Register Permanent SharedPreferences Native Storage Bridge
        webView.addJavascriptInterface(new StorageBridge(this), "AndroidStorage");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage msg) {
                Log.d(TAG, msg.message() + " [" + msg.sourceId() + ":" + msg.lineNumber() + "]");
                return true;
            }
        });

        // Start embedded local loopback server on fixed port to ensure consistent origin
        try {
            server = new AssetServer(getAssets());
            server.start();
            int port = server.getPort();
            Log.d(TAG, "Local loopback asset server running on port " + port);
            webView.loadUrl("http://127.0.0.1:" + port + "/index.html");
        } catch (Exception e) {
            Log.e(TAG, "Failed to start local server, falling back to direct asset URL", e);
            webView.loadUrl("file:///android_asset/www/index.html");
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (server != null) {
            server.stop();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    private static class AssetServer {
        private static final int BASE_PORT = 18420;
        private final AssetManager assets;
        private ServerSocket serverSocket;
        private volatile boolean running = false;
        private int port = 0;

        public AssetServer(AssetManager assets) {
            this.assets = assets;
        }

        public void start() throws Exception {
            // Try fixed port first to keep origin constant for persistent browser storage
            for (int p = BASE_PORT; p < BASE_PORT + 10; p++) {
                try {
                    serverSocket = new ServerSocket(p, 50, InetAddress.getByName("127.0.0.1"));
                    port = p;
                    break;
                } catch (Exception ignored) {}
            }
            if (serverSocket == null) {
                serverSocket = new ServerSocket(0, 50, InetAddress.getByName("127.0.0.1"));
                port = serverSocket.getLocalPort();
            }

            running = true;

            Thread serverThread = new Thread(new Runnable() {
                @Override
                public void run() {
                    while (running) {
                        try {
                            Socket client = serverSocket.accept();
                            handleClient(client);
                        } catch (Exception e) {
                            if (!running) break;
                        }
                    }
                }
            });
            serverThread.setDaemon(true);
            serverThread.start();
        }

        public int getPort() {
            return port;
        }

        public void stop() {
            running = false;
            try {
                if (serverSocket != null) serverSocket.close();
            } catch (Exception ignored) {}
        }

        private void handleClient(final Socket socket) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                        String requestLine = in.readLine();
                        if (requestLine == null) {
                            socket.close();
                            return;
                        }

                        String[] parts = requestLine.split(" ");
                        if (parts.length < 2) {
                            socket.close();
                            return;
                        }

                        String path = parts[1];
                        int queryIdx = path.indexOf('?');
                        if (queryIdx != -1) path = path.substring(0, queryIdx);
                        if (path.equals("/") || path.isEmpty()) path = "/index.html";

                        String assetPath = "www" + path;
                        InputStream is = null;
                        try {
                            is = assets.open(assetPath);
                        } catch (Exception e) {
                            // Fallback to index.html for SPA client-side routes
                            try {
                                is = assets.open("www/index.html");
                                path = "/index.html";
                            } catch (Exception ignored) {}
                        }

                        OutputStream out = socket.getOutputStream();
                        if (is != null) {
                            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                            byte[] data = new byte[8192];
                            int nRead;
                            while ((nRead = is.read(data, 0, data.length)) != -1) {
                                buffer.write(data, 0, nRead);
                            }
                            byte[] body = buffer.toByteArray();
                            is.close();

                            String mime = getMimeType(path);
                            String header = "HTTP/1.1 200 OK\r\n"
                                    + "Content-Type: " + mime + "\r\n"
                                    + "Content-Length: " + body.length + "\r\n"
                                    + "Access-Control-Allow-Origin: *\r\n"
                                    + "Connection: close\r\n\r\n";
                            out.write(header.getBytes("UTF-8"));
                            out.write(body);
                            out.flush();
                        } else {
                            String notFound = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
                            out.write(notFound.getBytes("UTF-8"));
                            out.flush();
                        }
                        socket.close();
                    } catch (Exception ignored) {
                        try { socket.close(); } catch (Exception ignored2) {}
                    }
                }
            }).start();
        }

        private String getMimeType(String path) {
            String lower = path.toLowerCase();
            if (lower.endsWith(".html")) return "text/html; charset=utf-8";
            if (lower.endsWith(".js")) return "application/javascript; charset=utf-8";
            if (lower.endsWith(".css")) return "text/css; charset=utf-8";
            if (lower.endsWith(".json")) return "application/json; charset=utf-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }
    }
}
EOF

# 7. Generate R.java with aapt
echo "Generating R.java with aapt..."
aapt package -f -m \
  -J "$BUILD_DIR/src" \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -I /opt/android-build/android.jar

# 8. Compile Java classes
echo "Compiling Java sources..."
javac -source 1.8 -target 1.8 \
  -bootclasspath /opt/android-build/android.jar \
  -cp /opt/android-build/android.jar \
  -d "$BUILD_DIR/obj" \
  $(find "$BUILD_DIR/src" -name "*.java")

# 9. Convert classes to DEX with D8
echo "Running D8 dexer..."
java -cp /opt/android-build/r8.jar com.android.tools.r8.D8 \
  --min-api 21 \
  --lib /opt/android-build/android.jar \
  --output "$BUILD_DIR/dex" \
  $(find "$BUILD_DIR/obj" -name "*.class")

# 10. Package APK with assets and resources
echo "Packaging APK..."
aapt package -f \
  -M "$BUILD_DIR/AndroidManifest.xml" \
  -S "$BUILD_DIR/res" \
  -A "$BUILD_DIR/assets" \
  -I /opt/android-build/android.jar \
  -F "$BUILD_DIR/unaligned.apk"

# 11. Add classes.dex into APK
(cd "$BUILD_DIR/dex" && aapt add "$BUILD_DIR/unaligned.apk" classes.dex)

# 12. 4-byte Zipalign
echo "Aligning APK with zipalign..."
zipalign -f -v -p 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/aligned.apk" > /dev/null

# 13. Sign APK with apksigner
KEYSTORE="$BUILD_DIR/debug.keystore"
keytool -genkeypair -v \
  -keystore "$KEYSTORE" \
  -storepass android \
  -alias androiddebugkey \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=NIWAS,O=NIWAS Register,C=IN" > /dev/null 2>&1

echo "Signing APK..."
OUTPUT_APK="$ROOT_DIR/public/NIWAS.apk"
apksigner sign \
  --ks "$KEYSTORE" \
  --ks-pass pass:android \
  --key-pass pass:android \
  --out "$OUTPUT_APK" \
  "$BUILD_DIR/aligned.apk"

# Also copy to root and standard release names
cp "$OUTPUT_APK" "$ROOT_DIR/NIWAS.apk"
cp "$OUTPUT_APK" "$ROOT_DIR/public/SSC_CGL_Register.apk"
cp "$OUTPUT_APK" "$ROOT_DIR/SSC_CGL_Register.apk"
cp "$OUTPUT_APK" "$ROOT_DIR/public/app-release.apk"

echo "Verifying APK..."
apksigner verify -v "$OUTPUT_APK"

echo "=== APK Successfully Built and Signed! ==="
ls -lh "$OUTPUT_APK"
ls -lh "$ROOT_DIR/NIWAS.apk"
