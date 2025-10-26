import { faker } from '@faker-js/faker';

export function generateAnalytics(count = 30) {
  return Array.from({ length: count }, () => ({
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    visits: faker.number.int({ min: 1, max: 100 }),
    purchases: faker.number.int({ min: 0, max: 20 }),
    revenue: faker.commerce.price({ min: 0, max: 5000 }),
    lastActive: faker.date.recent(),
    location: faker.location.country(),
    device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
    browser: faker.internet.userAgent(),
    conversionRate: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    avgOrderValue: faker.commerce.price({ min: 10, max: 500 }),
    cartAbandonRate: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    feedback: faker.lorem.sentence(),
    joined: faker.date.past(),
  }));
}
