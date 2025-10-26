import { faker } from '@faker-js/faker';

// Returns '/cart_1.png' or '/cart_2.png' randomly
export function getRandomCartImage(): string {
  return Math.random() < 0.5 ? '/cart_1.png' : '/cart_2.png';
}

export function generateProducts(count = 20) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    image: getRandomCartImage(),
    category: faker.commerce.department(),
    brand: faker.company.name(),
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    stock: faker.number.int({ min: 0, max: 100 }),
    reviews: faker.number.int({ min: 0, max: 500 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    sku: faker.commerce.isbn(),
    color: faker.color.human(),
    material: faker.commerce.productMaterial(),
    discount: faker.number.int({ min: 0, max: 50 }),
    tags: faker.lorem.words({ min: 2, max: 5 }).split(' '),
  }));
}
