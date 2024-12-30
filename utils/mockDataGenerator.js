const firstNames = ['Emily', 'James', 'Sofia', 'Michael', 'Emma', 'William'];
const cities = ['Toronto', 'Vancouver', 'New York', 'London', 'Sydney', 'Paris'];

function generateMockPurchase() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  return {
    customerName: firstName,
    location: city,
    timestamp: new Date(),
    productName: 'Sample Product', // We'll expand this later
  };
}

module.exports = {
  generateMockPurchase
};