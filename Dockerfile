# Gunakan image Node.js 20
FROM node:20

# Set working directory
WORKDIR /app

# Salin package.json & package-lock.json dulu
COPY package*.json ./

# Salin folder prisma supaya postinstall prisma generate bisa jalan
COPY prisma ./prisma

# Install dependencies (postinstall akan menjalankan prisma generate)
RUN npm install

# Salin semua file lainnya
COPY . .

# Expose port (ubah sesuai port aplikasi)
EXPOSE 3000

# Jalankan app
CMD ["npm", "start"]