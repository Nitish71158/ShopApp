const dotenv = require('dotenv');
dotenv.config();

const connectDb = require('./config/db');
const bcrypt = require('bcryptjs');

const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');

const run = async () => {
	try {
		await connectDb();

		// clear existing data
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		// create users
		const password = await bcrypt.hash('password123', 10);
		const adminUser = await User.create({
			name: 'Admin User',
			email: 'admin@example.com',
			password,
			role: 'admin',
			verified: true,
			otp: Math.floor(100000 + Math.random() * 900000),
		});

		const normalUser = await User.create({
			name: 'John Doe',
			email: 'john@example.com',
			password,
			role: 'user',
			verified: false,
			otp: Math.floor(100000 + Math.random() * 900000),
		});

		// create products
		const productsData = [
			{ name: 'Sample Book', description: 'A great read', price: 12.99, category: 'Books', imageUrl: 'https://placehold.co/600x400' },
			{ name: 'T-Shirt', description: 'Comfortable cotton tee', price: 19.99, category: 'Apparel', imageUrl: 'https://placehold.co/600x400' },
			{ name: 'Coffee Mug', description: 'Ceramic mug', price: 8.5, category: 'Kitchen', imageUrl: 'https://placehold.co/600x400' },
		];

		const createdProducts = await Product.insertMany(productsData);

		// create an order for normalUser using first two products
		const order = await Order.create({
			user: normalUser._id,
			item: [
				{ productId: createdProducts[0]._id, quantity: 1, price: createdProducts[0].price },
				{ productId: createdProducts[1]._id, quantity: 2, price: createdProducts[1].price },
			],
			totalAmount: createdProducts[0].price * 1 + createdProducts[1].price * 2,
			address: {
				fullName: 'John Doe',
				street: '123 Main St',
				city: 'Cityville',
				postalCode: '12345',
				country: 'Country',
			},
			paymentId: 'pay_demo_' + Math.random().toString(36).slice(2, 9),
		});

		console.log('Seed complete.');
		console.log('Admin:', { email: adminUser.email, password: 'password123', otp: adminUser.otp });
		console.log('User:', { email: normalUser.email, password: 'password123', otp: normalUser.otp });
		process.exit();
	} catch (error) {
		console.error('Seed error:', error);
		process.exit(1);
	}
};

run();
