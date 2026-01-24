FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 删除构建步骤 - 不要在Docker构建阶段构建Next.js
# RUN npm run build  # ❌ 删除这行

EXPOSE 7860
ENV PORT=7860

# 改为在运行时构建和启动
CMD ["sh", "-c", "npm run build && npm start"]