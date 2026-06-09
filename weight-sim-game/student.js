// Student class definition

class Student {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.weight = 55 + Math.floor(Math.random() * 20); // Random weight between 55-75 kg
        this.height = 160 + Math.floor(Math.random() * 20); // Random height between 160-180 cm
        this.bmi = this.calculateBMI();
        this.healthStatus = 'Healthy'; // Healthy, Underweight, Overweight, Obese
        this.academicPerformance = 70 + Math.floor(Math.random() * 30); // Random performance 70-100
        this.energyLevel = 80 + Math.floor(Math.random() * 20); // Random energy 80-100
        this.stressLevel = 30 + Math.floor(Math.random() * 40); // Random stress 30-70
        this.studyHours = 5 + Math.floor(Math.random() * 10); // Random study hours 5-15
    }

    calculateBMI() {
        // BMI = weight (kg) / [height (m)]²
        const heightInMeters = this.height / 100;
        return this.weight / (heightInMeters * heightInMeters);
    }

    updateHealthStatus() {
        if (this.bmi < 18.5) {
            this.healthStatus = 'Underweight';
        } else if (this.bmi >= 18.5 && this.bmi <= 24.9) {
            this.healthStatus = 'Healthy';
        } else if (this.bmi >= 25 && this.bmi <= 29.9) {
            this.healthStatus = 'Overweight';
        } else {
            this.healthStatus = 'Obese';
        }
    }

    healthCheckup() {
        console.log(`\n--- Health Checkup for ${this.name} ---`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Height: ${this.height} cm`);
        console.log(`BMI: ${this.bmi.toFixed(1)}`);
        console.log(`Health Status: ${this.healthStatus}`);
        console.log(`Academic Performance: ${this.academicPerformance}%`);
        console.log(`Energy Level: ${this.energyLevel}/100`);
        console.log(`Stress Level: ${this.stressLevel}/100`);
    }

    displayProfile() {
        console.log(`\nName: ${this.name}`);
        console.log(`ID: ${this.id}`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Height: ${this.height} cm`);
        console.log(`BMI: ${this.bmi.toFixed(1)}`);
        console.log(`Health Status: ${this.healthStatus}`);
    }

    displayDetailedProfile() {
        console.log(`\n=== DETAILED PROFILE FOR ${this.name.toUpperCase()} ===`);
        console.log(`ID: ${this.id}`);
        console.log(`Weight: ${this.weight} kg`);
        console.log(`Height: ${this.height} cm`);
        console.log(`BMI: ${this.bmi.toFixed(1)}`);
        console.log(`Health Status: ${this.healthStatus}`);
        console.log(`Academic Performance: ${this.academicPerformance}%`);
        console.log(`Energy Level: ${this.energyLevel}/100`);
        console.log(`Stress Level: ${this.stressLevel}/100`);
        console.log(`Study Hours: ${this.studyHours} hours/week`);
    }

    hasHealthConcern() {
        return this.bmi < 18.5 || this.bmi > 24.9;
    }

    // Methods for game interactions
    gainWeight(amount) {
        this.weight += amount;
        this.bmi = this.calculateBMI();
        this.updateHealthStatus();
    }

    loseWeight(amount) {
        this.weight -= amount;
        this.bmi = this.calculateBMI();
        this.updateHealthStatus();
    }

    updateAcademicPerformance(change) {
        this.academicPerformance = Math.max(0, Math.min(100, this.academicPerformance + change));
    }

    updateEnergyLevel(change) {
        this.energyLevel = Math.max(0, Math.min(100, this.energyLevel + change));
    }

    updateStressLevel(change) {
        this.stressLevel = Math.max(0, Math.min(100, this.stressLevel + change));
    }
}

module.exports = { Student };