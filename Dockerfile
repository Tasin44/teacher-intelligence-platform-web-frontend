FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir .next && chown node:node .next

COPY --chown=node:node public ./public
COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static

USER node

EXPOSE 3005
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
