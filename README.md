# Loan API (NestJS + JSON files)

    npm install
    npm run start:dev      # http://localhost:3000

Dummy users (data/users.json): rahul@example.com / password123, priya@example.com / password123

    # 1. login
    curl -X POST localhost:3000/auth/login -H "Content-Type: application/json" \
      -d '{"email":"rahul@example.com","password":"password123"}'

    # 2. use the accessToken
    TOKEN=<paste accessToken>
    curl localhost:3000/auth/me -H "Authorization: Bearer $TOKEN"
    curl localhost:3000/loans -H "Authorization: Bearer $TOKEN"
    curl localhost:3000/loans/personal-loan -H "Authorization: Bearer $TOKEN"

    # 3. apply
    curl -X POST localhost:3000/loans/apply -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"loanId":"personal-loan","amount":200000,"tenureMonths":24,"purpose":"Wedding"}'

    # 4. my applications
    curl localhost:3000/loans/applications/mine -H "Authorization: Bearer $TOKEN"
