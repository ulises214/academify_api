pnpm install
pnpm prisma:prod generate
pm2 delete academify-api
pm2 start pnpm --name "academify-api" -- start:prod
