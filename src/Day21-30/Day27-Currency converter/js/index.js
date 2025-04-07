
        // Currency data with codes, names and flags
        const currencyData = {
            "USD": {
                "name": "US Dollar",
                "flag": "US"
            },
            "EUR": {
                "name": "Euro",
                "flag": "EU"
            },
            "GBP": {
                "name": "British Pound",
                "flag": "GB"
            },
            "JPY": {
                "name": "Japanese Yen",
                "flag": "JP"
            },
            "CNY": {
                "name": "Chinese Yuan",
                "flag": "CN"
            },
            "INR": {
                "name": "Indian Rupee",
                "flag": "IN"
            },
            "CAD": {
                "name": "Canadian Dollar",
                "flag": "CA"
            },
            "AUD": {
                "name": "Australian Dollar",
                "flag": "AU"
            },
            "GHS": {
                "name": "Ghana Cedi",
                "flag": "GH"
            },
            "NGN": {
                "name": "Nigerian Naira",
                "flag": "NG"
            },
            "ZAR": {
                "name": "South African Rand",
                "flag": "ZA"
            },
            "BTC": {
                "name": "Bitcoin",
                "flag": "BTC" // Special case for Bitcoin - handle separately
            }
        };

        // Get DOM elements
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const fromFlag = document.getElementById('fromFlag');
        const toFlag = document.getElementById('toFlag');
        const convertBtn = document.getElementById('convertBtn');
        const swapBtn = document.getElementById('swapBtn');
        const inputElement = document.getElementById('inputElement');
        const resultsDisplay = document.getElementById('resultsDisplay');
        const fromAmount = document.getElementById('fromAmount');
        const toAmount = document.getElementById('toAmount');
        const fromFullName = document.getElementById('fromFullName');
        const toFullName = document.getElementById('toFullName');
        const errorMessageElement = document.getElementById("error-message");

        // API URLs
        const CURRENCY_LIST_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";
        const EXCHANGE_RATE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
        const FLAG_API_URL = "https://flagsapi.com";

        // Populate currency dropdowns
        function populateDropdowns() {
            // Clear existing options (except the placeholder)
            fromCurrency.innerHTML = '<option value="" disabled selected class="text-gray-500">From</option>';
            toCurrency.innerHTML = '<option value="" disabled selected class="text-gray-500">To</option>';
            
            // Add currency options
            Object.keys(currencyData).forEach(currency => {
                const fromOption = document.createElement('option');
                fromOption.value = currency;
                fromOption.textContent = `${currency} - ${currencyData[currency].name}`;
                fromCurrency.appendChild(fromOption);
                
                const toOption = document.createElement('option');
                toOption.value = currency;
                toOption.textContent = `${currency} - ${currencyData[currency].name}`;
                toCurrency.appendChild(toOption);
            });
            
            // Set default values
            fromCurrency.value = "USD";
            toCurrency.value = "EUR";
            
            // Update flags for default values
            updateFlags();
        }

        // Update currency flags
        function updateFlags() {
            updateFlag(fromCurrency.value, fromFlag.querySelector('img'));
            updateFlag(toCurrency.value, toFlag.querySelector('img'));
        }

        // Update a specific flag element
        function updateFlag(currencyCode, imgElement) {
            if (currencyCode && currencyData[currencyCode]) {
                const countryCode = currencyData[currencyCode].flag;
                
                // Special case for Bitcoin
                if (currencyCode === "BTC") {
                    // Use a placeholder or Bitcoin symbol for BTC
                    imgElement.src = "/api/placeholder/64/64";
                    imgElement.alt = "Bitcoin";
                } else {
                    // Use the flag API for country flags
                    imgElement.src = `${FLAG_API_URL}/${countryCode}/flat/64.png`;
                    imgElement.alt = currencyData[currencyCode].name;
                }
            }
        }

        // Convert currency

        async function convertCurrency() {
    const errorMessageElement = document.getElementById("error-message");

    if (!fromCurrency.value || !toCurrency.value || !inputElement.value) {
        errorMessageElement.textContent = "Please select currencies and enter an amount.";
        errorMessageElement.classList.remove("hidden");
        return;
    }

    try {
        errorMessageElement.classList.add("hidden"); // Hide error messages on new attempts
        const amount = parseFloat(inputElement.value);
        const from = fromCurrency.value.toLowerCase();
        const to = toCurrency.value.toLowerCase();

        // Fetch the latest exchange rate
        const response = await fetch(`${EXCHANGE_RATE_URL}/${from}.json`);
        const data = await response.json();

        if (data && data[from] && data[from][to]) {
            const rate = data[from][to];
            const convertedAmount = (amount * rate).toFixed(2);

            // Update the results display
            fromAmount.textContent = amount.toFixed(2);
            toAmount.textContent = convertedAmount;
            fromFullName.textContent = currencyData[fromCurrency.value].name;
            toFullName.textContent = currencyData[toCurrency.value].name;

            // Show the results
            resultsDisplay.classList.remove("hidden");
        } else {
            errorMessageElement.textContent = "Couldn't get exchange rate data.";
            errorMessageElement.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error converting currency:", error);
        errorMessageElement.textContent = "Failed to convert currency. Please try again.";
        errorMessageElement.classList.remove("hidden");
    }
}

       


        // Swap currencies
        function swapCurrencies() {
            const tempCurrency = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempCurrency;
            updateFlags();
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', populateDropdowns);
        fromCurrency.addEventListener('change', updateFlags);
        toCurrency.addEventListener('change', updateFlags);
        convertBtn.addEventListener('click', convertCurrency);
        swapBtn.addEventListener('click', swapCurrencies);
   