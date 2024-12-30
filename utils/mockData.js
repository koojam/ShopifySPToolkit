const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 
  'Sophia', 'Mason', 'Isabella', 'William'
];

const cities = [
  'Toronto', 'Vancouver', 'Montreal', 'New York', 'London', 
  'Sydney', 'Paris', 'Tokyo', 'Berlin', 'Amsterdam'
];

const products = [
  { name: 'Classic T-Shirt', price: 29.99 },
  { name: 'Denim Jeans', price: 89.99 },
  { name: 'Running Shoes', price: 119.99 },
  { name: 'Backpack', price: 59.99 },
  { name: 'Watch', price: 199.99 }
];

function generateMockPurchase() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  
  return {
    customerName: firstName,
    location: city,
    timestamp: new Date(),
    productName: product.name,
    price: product.price,
    timeAgo: '2 minutes ago' // We'll make this dynamic later
  };
}

module.exports = {
  generateMockPurchase
}; 