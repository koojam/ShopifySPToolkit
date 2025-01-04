const names = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
    'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Lucas', 'Amelia'
];

const locations = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Berlin', 'Toronto',
    'Amsterdam', 'Singapore', 'Dubai', 'Mumbai', 'Seoul', 'Madrid', 'Rome'
];

const products = [
    { name: 'Classic T-Shirt', price: 29.99 },
    { name: 'Denim Jeans', price: 89.99 },
    { name: 'Running Shoes', price: 119.99 },
    { name: 'Leather Wallet', price: 49.99 },
    { name: 'Sunglasses', price: 79.99 },
    { name: 'Watch', price: 199.99 },
    { name: 'Backpack', price: 69.99 },
    { name: 'Phone Case', price: 24.99 }
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateMockPurchase() {
    const product = getRandomItem(products);
    
    return {
        customer: getRandomItem(names),
        location: getRandomItem(locations),
        product: product.name,
        price: product.price,
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    generateMockPurchase
}; 