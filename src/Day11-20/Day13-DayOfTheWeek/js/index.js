
        function displayDay(){
            const days = [
                {
                    name:'Sunday',
                    emoji: '🤲🏽',
                    quote: 'Time to worship'
                },
                {
                    name:'Monday',
                    emoji: '🧐',
                    quote: 'New week, new goals!'
                },
                {
                    name:'Tuesday',
                    emoji: '🚀',
                    quote: 'Momentum building!'
                },
                {
                   name:'Wednesday',
                    emoji: '🌈',
                    quote: 'Halfway through!' 
                },
                {
                    name:'Thursday',
                    emoji: '🥳',
                    quote: 'Almost there!' 
                },
                {
                    name:'Friday',
                    emoji: '😎',
                    quote: 'The weekend is here!' 
                },
                {
                    name:'Saturday',
                    emoji: '🍹',
                    quote: 'Time to partyyyy!' 
                }
            ];

            const today = new Date().getDay();
            const dayInfo = days[today];

            document.getElementById('dayDisplay').innerHTML = `${dayInfo.name} ${dayInfo.emoji}`;
            document.getElementById('dayQuote').textContent = dayInfo.quote
        }
        displayDay();
    