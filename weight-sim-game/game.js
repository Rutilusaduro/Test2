// Game logic and main functions

const readlineSync = require('readline-sync');
const { Student } = require('./student');
const { Professor } = require('./professor');

let professor;
let students = [];
let gameDay = 1;
let gameYear = 2024;

function startGame() {
    console.log('Creating your college simulation...');
    
    // Initialize professor
    professor = new Professor();
    
    // Create sample students
    createSampleStudents();
    
    // Start main game loop
    mainMenu();
}

function createSampleStudents() {
    const studentNames = [
        'Emma Johnson', 'Olivia Williams', 'Ava Brown', 'Isabella Jones',
        'Sophia Garcia', 'Mia Miller', 'Charlotte Davis', 'Amelia Rodriguez'
    ];
    
    for (let i = 0; i < 8; i++) {
        students.push(new Student(studentNames[i], i + 1));
    }
    
    console.log(`Created ${students.length} student profiles.`);
}

function mainMenu() {
    while (true) {
        console.log('\n=== MAIN MENU ===');
        console.log(`Day: ${gameDay}, Year: ${gameYear}`);
        console.log('1. View Student Profiles');
        console.log('2. Manage Students');
        console.log('3. View Class Progress');
        console.log('4. Academic Activities');
        console.log('5. Health Education');
        console.log('6. Save Game');
        console.log('7. Load Game');
        console.log('8. Exit Game');
        
        const choice = readlineSync.question('Choose an option (1-8): ');
        
        switch (choice) {
            case '1':
                viewStudentProfiles();
                break;
            case '2':
                manageStudents();
                break;
            case '3':
                viewClassProgress();
                break;
            case '4':
                academicActivities();
                break;
            case '5':
                healthEducation();
                break;
            case '6':
                saveGame();
                break;
            case '7':
                loadGame();
                break;
            case '8':
                console.log('Thanks for playing!');
                return;
            default:
                console.log('Invalid option. Please try again.');
        }
    }
}

function viewStudentProfiles() {
    console.log('\n=== STUDENT PROFILES ===');
    students.forEach(student => {
        student.displayProfile();
        console.log('---');
    });
    
    readlineSync.question('\nPress Enter to continue...');
}

function manageStudents() {
    console.log('\n=== MANAGE STUDENTS ===');
    console.log('1. View Individual Student');
    console.log('2. Assign Academic Task');
    console.log('3. Health Checkup');
    console.log('4. Return to Main Menu');
    
    const choice = readlineSync.question('Choose an option (1-4): ');
    
    switch (choice) {
        case '1':
            viewIndividualStudent();
            break;
        case '2':
            assignAcademicTask();
            break;
        case '3':
            healthCheckup();
            break;
        case '4':
            return;
        default:
            console.log('Invalid option.');
    }
}

function viewIndividualStudent() {
    console.log('\nSelect a student:');
    students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.name}`);
    });
    
    const choice = readlineSync.question('Choose a student (1-8): ');
    const studentIndex = parseInt(choice) - 1;
    
    if (studentIndex >= 0 && studentIndex < students.length) {
        students[studentIndex].displayDetailedProfile();
        readlineSync.question('\nPress Enter to continue...');
    } else {
        console.log('Invalid selection.');
    }
}

function assignAcademicTask() {
    console.log('\nAssign Academic Task:');
    console.log('1. Study Session');
    console.log('2. Research Project');
    console.log('3. Group Assignment');
    
    const choice = readlineSync.question('Choose task type (1-3): ');
    
    switch (choice) {
        case '1':
            console.log('Assigning study session...');
            // Implementation would go here
            break;
        case '2':
            console.log('Assigning research project...');
            // Implementation would go here
            break;
        case '3':
            console.log('Assigning group assignment...');
            // Implementation would go here
            break;
        default:
            console.log('Invalid task type.');
    }
}

function healthCheckup() {
    console.log('\nHealth Checkup for Students:');
    students.forEach(student => {
        student.healthCheckup();
    });
    
    readlineSync.question('\nPress Enter to continue...');
}

function viewClassProgress() {
    console.log('\n=== CLASS PROGRESS ===');
    console.log(`Total Students: ${students.length}`);
    console.log(`Average Weight: ${calculateAverageWeight().toFixed(1)} kg`);
    console.log(`Average BMI: ${calculateAverageBMI().toFixed(1)}`);
    
    // Show students with health concerns
    const studentsWithConcerns = students.filter(student => student.hasHealthConcern());
    if (studentsWithConcerns.length > 0) {
        console.log('\nStudents with health concerns:');
        studentsWithConcerns.forEach(student => {
            console.log(`- ${student.name}: BMI ${student.bmi.toFixed(1)}`);
        });
    }
    
    readlineSync.question('\nPress Enter to continue...');
}

function calculateAverageWeight() {
    const totalWeight = students.reduce((sum, student) => sum + student.weight, 0);
    return totalWeight / students.length;
}

function calculateAverageBMI() {
    const totalBMI = students.reduce((sum, student) => sum + student.bmi, 0);
    return totalBMI / students.length;
}

function academicActivities() {
    console.log('\n=== ACADEMIC ACTIVITIES ===');
    console.log('1. Lecture on Nutrition');
    console.log('2. Exercise Workshop');
    console.log('3. Weight Management Seminar');
    console.log('4. Return to Main Menu');
    
    const choice = readlineSync.question('Choose activity (1-4): ');
    
    switch (choice) {
        case '1':
            console.log('Delivering lecture on nutrition...');
            // Implementation would go here
            break;
        case '2':
            console.log('Organizing exercise workshop...');
            // Implementation would go here
            break;
        case '3':
            console.log('Hosting weight management seminar...');
            // Implementation would go here
            break;
        case '4':
            return;
        default:
            console.log('Invalid option.');
    }
}

function healthEducation() {
    console.log('\n=== HEALTH EDUCATION ===');
    console.log('1. BMI Information');
    console.log('2. Healthy Eating Tips');
    console.log('3. Exercise Recommendations');
    console.log('4. Return to Main Menu');
    
    const choice = readlineSync.question('Choose topic (1-4): ');
    
    switch (choice) {
        case '1':
            showBMIInfo();
            break;
        case '2':
            showEatingTips();
            break;
        case '3':
            showExerciseRecommendations();
            break;
        case '4':
            return;
        default:
            console.log('Invalid option.');
    }
}

function showBMIInfo() {
    console.log('\nBody Mass Index (BMI) Information:');
    console.log('- BMI < 18.5: Underweight');
    console.log('- BMI 18.5-24.9: Normal weight');
    console.log('- BMI 25-29.9: Overweight');
    console.log('- BMI ≥ 30: Obese');
    console.log('BMI is a screening tool, not a diagnostic tool.');
    
    readlineSync.question('\nPress Enter to continue...');
}

function showEatingTips() {
    console.log('\nHealthy Eating Tips:');
    console.log('1. Eat a balanced diet with fruits and vegetables');
    console.log('2. Control portion sizes');
    console.log('3. Stay hydrated with water');
    console.log('4. Limit processed foods');
    console.log('5. Include lean proteins in your meals');
    
    readlineSync.question('\nPress Enter to continue...');
}

function showExerciseRecommendations() {
    console.log('\nExercise Recommendations:');
    console.log('1. 150 minutes of moderate aerobic activity per week');
    console.log('2. Muscle-strengthening activities at least 2 days per week');
    console.log('3. Daily physical activity is beneficial');
    console.log('4. Find activities you enjoy to maintain consistency');
    
    readlineSync.question('\nPress Enter to continue...');
}

function saveGame() {
    console.log('\nSaving game...');
    // Implementation would go here
    console.log('Game saved successfully!');
    readlineSync.question('\nPress Enter to continue...');
}

function loadGame() {
    console.log('\nLoading game...');
    // Implementation would go here
    console.log('Game loaded successfully!');
    readlineSync.question('\nPress Enter to continue...');
}

module.exports = { startGame };