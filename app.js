let foods = [];
let totalCalories = 0;

const foodInput = document.getElementById('food-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const foodChart = document.getElementById('food-chart').getContext('2d');
const totalCaloriesSpan = document.getElementById('total-calories');

addBtn.addEventListener('click', function () {
    const food = foodInput.value;
    const date = dateInput.value;

    if (food === '' || date === '') {
        alert('Please fill in all fields with valid values');
        return;
    }

    // Get nutritional information based on the entered food item
    const nutritionalInfo = getNutritionalInfo(food);

    if (!nutritionalInfo) {
        alert('Nutritional information not available for this food item');
        return;
    }

    const { calories } = nutritionalInfo;

    foods.push({ food, calories, date });

    totalCalories += calories;

    updateSummary();
    updateChart();
});

function getNutritionalInfo(food) {
    // Example: A simple food database (replace this with a real database)
    const foodDatabase = {
        'apple': { calories: 95 },
        'banana': { calories: 105 },
        'orange': { calories: 62 },
        // Add more foods and their nutritional information
    };

    return foodDatabase[food.toLowerCase()];
}

function updateSummary() {
    totalCaloriesSpan.textContent = totalCalories;
}

function updateChart() {
    const labels = foods.map(food => food.food);
    const data = foods.map(food => food.calories);

    const chartData = {
        labels,
        datasets: [{
            label: 'Calories',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    new Chart(foodChart, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}
