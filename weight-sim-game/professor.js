// Professor class definition

class Professor {
    constructor() {
        this.name = 'Dr. Smith';
        this.department = 'Health & Nutrition';
        this.yearsExperience = 10;
        this.reputation = 75; // Reputation score out of 100
        this.studentCount = 8;
        this.currentActivity = 'Managing students';
    }

    displayProfile() {
        console.log(`\n=== PROFESSOR PROFILE ===`);
        console.log(`Name: ${this.name}`);
        console.log(`Department: ${this.department}`);
        console.log(`Years of Experience: ${this.yearsExperience}`);
        console.log(`Reputation: ${this.reputation}/100`);
        console.log(`Students Managed: ${this.studentCount}`);
        console.log(`Current Activity: ${this.currentActivity}`);
    }

    giveAdvice(student) {
        console.log(`\n${this.name}: "I recommend focusing on a balanced diet and regular exercise."`);
        console.log(`Your BMI is ${student.bmi.toFixed(1)}, which indicates ${student.healthStatus}.`);
        
        if (student.bmi < 18.5) {
            console.log("You're underweight. Consider eating more nutritious foods.");
        } else if (student.bmi > 24.9) {
            console.log("You're overweight. Try to incorporate more physical activity.");
        } else {
            console.log("Your weight is within a healthy range. Keep up the good work!");
        }
    }

    organizeActivity(activityType) {
        console.log(`\n${this.name} is organizing a ${activityType}...`);
        // Implementation would go here
    }

    updateReputation(change) {
        this.reputation = Math.max(0, Math.min(100, this.reputation + change));
    }
}

module.exports = { Professor };