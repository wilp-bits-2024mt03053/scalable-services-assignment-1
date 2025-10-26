import { faker } from '@faker-js/faker';

export function generateUsers(count = 30) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: faker.location.country(),
    },
    phone: faker.phone.number(),
    registeredAt: faker.date.past(),
    lastLogin: faker.date.recent(),
    isActive: faker.datatype.boolean(),
    orders: faker.number.int({ min: 0, max: 20 }),
    totalSpent: faker.commerce.price({ min: 100, max: 10000 }),
    wishlist: Array.from({ length: faker.number.int({ min: 0, max: 10 }) }, () =>
      faker.commerce.productName()
    ),
    cart: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () =>
      faker.commerce.productName()
    ),
    role: faker.helpers.arrayElement(['customer', 'admin', 'manager', 'support']),
    gender: faker.person.sexType(),
    birthdate: faker.date.birthdate(),
    notes: faker.lorem.sentence(),
  }));
}
