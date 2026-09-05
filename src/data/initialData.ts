import { Topic, MockTest, SubjectMeta } from '../types';

export const SUBJECT_METAS: Record<string, SubjectMeta> = {
  Math: {
    key: 'Math',
    displayName: 'Math / Quantitative Aptitude',
    shortName: 'Math',
    color: '#E57373', // Coral Red
    bgColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    description: 'Arithmetic, Advanced Mathematics & Data Interpretation',
    tier1Max: 50,
    tier2Max: 90,
  },
  English: {
    key: 'English',
    displayName: 'English Language & Comprehension',
    shortName: 'English',
    color: '#64B5F6', // Sky Blue
    bgColor: '#E3F2FD',
    borderColor: '#90CAF9',
    description: 'Grammar, Vocabulary & Reading Comprehension',
    tier1Max: 50,
    tier2Max: 135,
  },
  GK: {
    key: 'GK',
    displayName: 'General Knowledge & Awareness',
    shortName: 'GK',
    color: '#81C784', // Soft Green
    bgColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    description: 'History, Polity, Geography, Science & Current Affairs',
    tier1Max: 50,
    tier2Max: 75,
  },
  Reasoning: {
    key: 'Reasoning',
    displayName: 'General Intelligence & Reasoning',
    shortName: 'Reasoning',
    color: '#FFB74D', // Amber/Orange
    bgColor: '#FFF3E0',
    borderColor: '#FFCC80',
    description: 'Logical, Verbal & Non-Verbal Reasoning',
    tier1Max: 50,
    tier2Max: 90,
  },
};

export const INITIAL_TOPICS: Topic[] = [
  // Math / Quant (14 topics)
  { id: 1, subject: 'Math', name: 'Number System', isDone: true },
  { id: 2, subject: 'Math', name: 'HCF & LCM', isDone: true },
  { id: 3, subject: 'Math', name: 'Percentage', isDone: true },
  { id: 4, subject: 'Math', name: 'Ratio & Proportion', isDone: true },
  { id: 5, subject: 'Math', name: 'Average', isDone: false },
  { id: 6, subject: 'Math', name: 'Profit & Loss', isDone: true },
  { id: 7, subject: 'Math', name: 'SI & CI', isDone: false },
  { id: 8, subject: 'Math', name: 'Time Speed Distance', isDone: false },
  { id: 9, subject: 'Math', name: 'Time & Work', isDone: true },
  { id: 10, subject: 'Math', name: 'Mensuration', isDone: false },
  { id: 11, subject: 'Math', name: 'Algebra', isDone: false },
  { id: 12, subject: 'Math', name: 'Geometry', isDone: false },
  { id: 13, subject: 'Math', name: 'Trigonometry', isDone: false },
  { id: 14, subject: 'Math', name: 'Data Interpretation', isDone: false },

  // English (10 topics)
  { id: 15, subject: 'English', name: 'Vocabulary', isDone: true },
  { id: 16, subject: 'English', name: 'Grammar/Error Spotting', isDone: true },
  { id: 17, subject: 'English', name: 'Sentence Improvement', isDone: false },
  { id: 18, subject: 'English', name: 'Para Jumbles', isDone: false },
  { id: 19, subject: 'English', name: 'Cloze Test', isDone: true },
  { id: 20, subject: 'English', name: 'Reading Comprehension', isDone: false },
  { id: 21, subject: 'English', name: 'Synonyms & Antonyms', isDone: true },
  { id: 22, subject: 'English', name: 'Idioms', isDone: false },
  { id: 23, subject: 'English', name: 'One Word Sub', isDone: false },
  { id: 24, subject: 'English', name: 'Spelling', isDone: true },

  // GK (10 topics)
  { id: 25, subject: 'GK', name: 'History', isDone: true },
  { id: 26, subject: 'GK', name: 'Polity', isDone: true },
  { id: 27, subject: 'GK', name: 'Geography', isDone: false },
  { id: 28, subject: 'GK', name: 'Economy', isDone: false },
  { id: 29, subject: 'GK', name: 'Static GK', isDone: true },
  { id: 30, subject: 'GK', name: 'Science', isDone: false },
  { id: 31, subject: 'GK', name: 'Current Affairs', isDone: true },
  { id: 32, subject: 'GK', name: 'Important Days', isDone: false },
  { id: 33, subject: 'GK', name: 'Sports', isDone: false },
  { id: 34, subject: 'GK', name: 'Govt Schemes', isDone: true },

  // Reasoning (12 topics)
  { id: 35, subject: 'Reasoning', name: 'Analogy', isDone: true },
  { id: 36, subject: 'Reasoning', name: 'Classification', isDone: true },
  { id: 37, subject: 'Reasoning', name: 'Series', isDone: true },
  { id: 38, subject: 'Reasoning', name: 'Coding-Decoding', isDone: true },
  { id: 39, subject: 'Reasoning', name: 'Blood Relations', isDone: true },
  { id: 40, subject: 'Reasoning', name: 'Direction Sense', isDone: false },
  { id: 41, subject: 'Reasoning', name: 'Ranking', isDone: false },
  { id: 42, subject: 'Reasoning', name: 'Syllogism', isDone: true },
  { id: 43, subject: 'Reasoning', name: 'Venn Diagrams', isDone: true },
  { id: 44, subject: 'Reasoning', name: 'Seating Arrangement', isDone: false },
  { id: 45, subject: 'Reasoning', name: 'Puzzle', isDone: false },
  { id: 46, subject: 'Reasoning', name: 'Mirror/Water Images', isDone: true },
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 1,
    type: 'Tier 1 (Prelims)',
    date: '2026-08-14',
    score: 132,
    maxScore: 200,
    sections: {
      math: 32,
      english: 34,
      gk: 20,
      reasoning: 46,
    },
    note: 'Good attempt in Reasoning (46/50). Need speed in Quant algebra.',
  },
  {
    id: 2,
    type: 'Tier 1 (Prelims)',
    date: '2026-08-20',
    score: 144,
    maxScore: 200,
    sections: {
      math: 36,
      english: 39,
      gk: 23,
      reasoning: 46,
    },
    note: 'Accuracy improved in English. GK questions were tricky on ancient history.',
  },
  {
    id: 3,
    type: 'Tier 1 (Prelims)',
    date: '2026-08-27',
    score: 151,
    maxScore: 200,
    sections: {
      math: 44,
      english: 42,
      gk: 19,
      reasoning: 46,
    },
    note: 'Crossed 150+ milestone! Quant: 44, Reasoning: 46, English: 42, GK: 19.',
  },
  {
    id: 4,
    type: 'Tier 1 (Prelims)',
    date: '2026-09-02',
    score: 158,
    maxScore: 200,
    sections: {
      math: 46,
      english: 44,
      gk: 22,
      reasoning: 46,
    },
    note: 'Highest Prelims score so far. DI calculation was smooth.',
  },
  {
    id: 5,
    type: 'Tier 2 (Mains)',
    date: '2026-09-04',
    score: 285,
    maxScore: 390,
    sections: {
      math: 72, // out of 90 (80%)
      english: 104, // out of 135 (77%)
      gk: 35, // out of 75 (47%)
      reasoning: 74, // out of 90 (82%)
      computer: 42, // qualifying out of 60
    },
    note: 'First Tier 2 full-length mock. Computer knowledge section passed (42/60).',
  },
];

// Target SSC CGL Exam Date default (approx 45 days from current simulated date)
export const DEFAULT_EXAM_DATE = '2026-10-25';

export const ANDROID_SOURCE_FILES = {
  'MainActivity.kt': `package com.sscprep.cglregister

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import com.sscprep.cglregister.ui.theme.*
import com.sscprep.cglregister.ui.screens.*
import com.sscprep.cglregister.viewmodel.RegisterViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SSCCGLRegisterTheme {
                MainAppLayout()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppLayout(viewModel: RegisterViewModel = viewModel()) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "dashboard"

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = "SSC CGL Register", 
                        color = Color.White,
                        style = MaterialTheme.typography.titleLarge
                    ) 
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepNavy)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = DeepNavy) {
                val screens = listOf(
                    NavigationItem("dashboard", "Dashboard", Icons.Default.Dashboard),
                    NavigationItem("syllabus", "Syllabus", Icons.Default.Checklist),
                    NavigationItem("mocks", "Mock Tests", Icons.Default.Assessment)
                )
                screens.forEach { screen ->
                    NavigationBarItem(
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(screen.icon, contentDescription = screen.title, tint = if (currentRoute == screen.route) GoldAccent else Color.White.copy(alpha = 0.7f)) },
                        label = { Text(screen.title, color = if (currentRoute == screen.route) GoldAccent else Color.White.copy(alpha = 0.7f)) }
                    )
                }
            }
        },
        containerColor = CreamBackground
    ) { innerPadding ->
        NavHost(
            navController = navController, 
            startDestination = "dashboard",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("dashboard") { DashboardScreen(viewModel) }
            composable("syllabus") { SyllabusScreen(viewModel) }
            composable("mocks") { MockScreen(viewModel) }
        }
    }
}`,

  'Data.kt': `package com.sscprep.cglregister.data

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

@Entity(tableName = "topics")
data class Topic(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val subject: String,
    val name: String,
    val isDone: Boolean = false
)

@Entity(tableName = "mock_tests")
data class MockTest(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val type: String, // "Tier 1 (Prelims)" or "Tier 2 (Mains)"
    val date: Long,
    val score: Int,
    val maxScore: Int,
    val mathScore: Int = 0,
    val englishScore: Int = 0,
    val gkScore: Int = 0,
    val reasoningScore: Int = 0,
    val note: String = ""
)

@Dao
interface AppDao {
    @Query("SELECT * FROM topics ORDER BY id ASC")
    fun getAllTopics(): Flow<List<Topic>>

    @Query("SELECT * FROM topics WHERE subject = :subject ORDER BY id ASC")
    fun getTopicsBySubject(subject: String): Flow<List<Topic>>

    @Update
    suspend fun updateTopic(topic: Topic)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTopics(topics: List<Topic>)

    @Query("SELECT COUNT(*) FROM topics")
    suspend fun getTopicCount(): Int

    @Query("SELECT * FROM mock_tests ORDER BY date DESC")
    fun getAllMocks(): Flow<List<MockTest>>

    @Insert
    suspend fun insertMock(mock: MockTest)

    @Delete
    suspend fun deleteMock(mock: MockTest)
}

@Database(entities = [Topic::class, MockTest::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): AppDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ssc_cgl_register_db"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DatabaseCallback(private val scope: CoroutineScope) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    populateInitialTopics(database.dao())
                }
            }
        }

        suspend fun populateInitialTopics(dao: AppDao) {
            val topics = listOf(
                // Math
                Topic(subject = "Math", name = "Number System"),
                Topic(subject = "Math", name = "HCF & LCM"),
                Topic(subject = "Math", name = "Percentage"),
                Topic(subject = "Math", name = "Ratio & Proportion"),
                Topic(subject = "Math", name = "Average"),
                Topic(subject = "Math", name = "Profit & Loss"),
                Topic(subject = "Math", name = "SI & CI"),
                Topic(subject = "Math", name = "Time Speed Distance"),
                Topic(subject = "Math", name = "Time & Work"),
                Topic(subject = "Math", name = "Mensuration"),
                Topic(subject = "Math", name = "Algebra"),
                Topic(subject = "Math", name = "Geometry"),
                Topic(subject = "Math", name = "Trigonometry"),
                Topic(subject = "Math", name = "Data Interpretation"),
                // English
                Topic(subject = "English", name = "Vocabulary"),
                Topic(subject = "English", name = "Grammar/Error Spotting"),
                Topic(subject = "English", name = "Sentence Improvement"),
                Topic(subject = "English", name = "Para Jumbles"),
                Topic(subject = "English", name = "Cloze Test"),
                Topic(subject = "English", name = "Reading Comprehension"),
                Topic(subject = "English", name = "Synonyms & Antonyms"),
                Topic(subject = "English", name = "Idioms"),
                Topic(subject = "English", name = "One Word Sub"),
                Topic(subject = "English", name = "Spelling"),
                // GK
                Topic(subject = "GK", name = "History"),
                Topic(subject = "GK", name = "Polity"),
                Topic(subject = "GK", name = "Geography"),
                Topic(subject = "GK", name = "Economy"),
                Topic(subject = "GK", name = "Static GK"),
                Topic(subject = "GK", name = "Science"),
                Topic(subject = "GK", name = "Current Affairs"),
                Topic(subject = "GK", name = "Important Days"),
                Topic(subject = "GK", name = "Sports"),
                Topic(subject = "GK", name = "Govt Schemes"),
                // Reasoning
                Topic(subject = "Reasoning", name = "Analogy"),
                Topic(subject = "Reasoning", name = "Classification"),
                Topic(subject = "Reasoning", name = "Series"),
                Topic(subject = "Reasoning", name = "Coding-Decoding"),
                Topic(subject = "Reasoning", name = "Blood Relations"),
                Topic(subject = "Reasoning", name = "Direction Sense"),
                Topic(subject = "Reasoning", name = "Ranking"),
                Topic(subject = "Reasoning", name = "Syllogism"),
                Topic(subject = "Reasoning", name = "Venn Diagrams"),
                Topic(subject = "Reasoning", name = "Seating Arrangement"),
                Topic(subject = "Reasoning", name = "Puzzle"),
                Topic(subject = "Reasoning", name = "Mirror/Water Images")
            )
            dao.insertTopics(topics)
        }
    }
}`,

  'build.gradle.kts': `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt")
}

android {
    namespace = "com.sscprep.cglregister"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.sscprep.cglregister"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
}

dependencies {
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
}`,

  'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SSC CGL Register"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SSCCGLRegister">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="SSC CGL Register"
            android:theme="@style/Theme.SSCCGLRegister">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
};
