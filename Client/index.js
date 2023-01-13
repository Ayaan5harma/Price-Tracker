
          // Add a submit event listener to the form
          document.getElementById('price-form').addEventListener('submit', function(event) {
            event.preventDefault();
    
            // Get the product link and desired price from the form
            const productlink = document.getElementById('productlink').value;
            const desiredprice = document.getElementById('desiredprice').value;
            const ChatID = document.getElementById('ChatID').value;
    
            // Make a POST request to the server to track the price
            fetch('http://localhost:3000/track-price', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ productlink, desiredprice ,ChatID})
            })
              .then(response => response.json())
              .then(data => {
                // Display a success or error message to the user
                const notification = document.getElementById('notification');
                if (data.success) {
                  notification.innerHTML = '<p class="success">Price tracking has been started!</p>';
                } else {
                  notification.innerHTML = '<p class="error">An error occurred: ' + data.error + '</p>';
                }
              });
          });
        
      