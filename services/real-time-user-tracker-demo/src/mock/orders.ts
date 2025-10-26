import { faker } from '@faker-js/faker';

export function generateOrders(count = 50) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    productId: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    total: faker.commerce.price({ min: 10, max: 2000 }),
    status: faker.helpers.arrayElement([
      'pending',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: faker.location.country(),
    },
    paymentMethod: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer', 'cod']),
    trackingNumber: faker.string.alphanumeric(12),
    notes: faker.lorem.sentence(),
    discount: faker.number.int({ min: 0, max: 30 }),
    tax: faker.commerce.price({ min: 0, max: 100 }),
    items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      productId: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      quantity: faker.number.int({ min: 1, max: 3 }),
    })),
  }));
}
