# Node.js 공식 경량화 이미지 사용
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /usr/src/app

# 패키지 정의 파일 복사 및 설치 (캐시 활용)
COPY package*.json ./
RUN npm install --only=production

# 소스 코드 전체 복사 (.gitignore 대상 제외)
COPY . .

# 컨테이너 노출 포트 (3000번)
EXPOSE 3000

# 서버 실행 명령어
CMD ["node", "app.js"]
