function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const data = parseCSV(csv);
            if (data) {
                const { labels, moistureValues } = data;

                // Plot the graph
                plotGraph(labels, moistureValues);

                // Display the dataset in the table
                displayDatasetInTable(labels, moistureValues);

                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully uploaded!',
                    text: 'Your dataset has been uploaded and visualized.',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: 'The dataset is incorrectly formatted. Please ensure it follows the correct structure.',
                    confirmButtonText: 'Try Again'
                });
            }
        };
        reader.readAsText(file);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No File Selected',
            text: 'Please select a file before attempting to upload.',
            confirmButtonText: 'OK'
        });
    }
}

function parseCSV(csv) {
    const rows = csv.split('\n').filter(row => row.trim() !== '');
    const labels = [];
    const moistureValues = [];
    rows.slice(1).forEach(row => {
        const cols = row.split(',');
        if (cols.length === 2) {
            labels.push(cols[0].trim());  // Date
            moistureValues.push(parseFloat(cols[1].trim()));  // Moisture value
        }
    });
    return { labels, moistureValues };
}

function plotGraph(labels, moistureValues) {
    const ctx = document.getElementById('soilChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Soil Moisture Content (%)',
                data: moistureValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,  // Animation speed
                easing: 'easeInOutQuad'  // Smoother transition
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayDatasetInTable(labels, moistureValues) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear existing data

    labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const moistureCell = document.createElement('td');

        dateCell.textContent = label;
        moistureCell.textContent = moistureValues[index];

        row.appendChild(dateCell);
        row.appendChild(moistureCell);
        tableBody.appendChild(row);
    });
}
