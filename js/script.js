let api_key = '92152524767214bbbc6626af17e24b24';
let city = 'atlanta'


fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${api_key}`)
    .then(function (res) {
        // Send the parsed json data to the next .then() in the chain    
        return res.json();
    }).then(function (data) {
        // Loop over forecast array 
        data.list.forEach(function (chunk) {
            // Get the date of the current forecast 3-hour chunk
            var forecastDate = dayjs(chunk.dt_txt);
            // Get the current date from your computer
            var currentDate = dayjs();

            // Condition to check against if the current chunk date(day of month) is today's date - This will avoid data for today and only give us the next 5 days
            if (forecastDate.date() !== currentDate.date()) {
                // Get the hour from the current forecast 3-hour chunk
                var hour = forecastDate.hour();

                // Check if the hour is noon
                if (hour === 12) {
                    // Do what you need with the noon forecast chunk
                    console.log(chunk);
                }
            }
        })
    })