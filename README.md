# Smart Lab Attendance

Base de projet pour automatiser la gestion des entrées et sorties du laboratoire universitaire.

## Stack

- `apps/api` : NestJS + Prisma + PostgreSQL
- `apps/web` : Next.js + TypeScript
- `packages/vision` : contrat Python/OpenCV, sans reconnaissance réelle dans cette étape
- `docker-compose.yml` : PostgreSQL local

## Démarrage

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Dashboard : `http://localhost:3000`. API : `http://localhost:3001/api`.

## Simulation ENTRY / EXIT

Créer un étudiant via `POST /api/students`, puis envoyer `POST /api/movements` avec `studentId`, `type` (`ENTRY` ou `EXIT`) et optionnellement `timestamp`, `confidence`, `cameraId`. Les mouvements sont immuables ; le dernier mouvement détermine la présence, et chaque paire entrée/sortie produit une session.

Le moteur Python publie ce même contrat via `POST /api/vision/events`. Les coupures caméra et la synchronisation offline sont réservées à une étape suivante ; aucune sortie n’est inventée pendant une panne.

Le setup Windows peut aussi être lancé depuis la racine avec `npm run vision:setup`, puis `npm run vision:run`.

## Moteur IA OpenCV

Le moteur se trouve dans `packages/vision`. Il utilise YOLO pré-entraîné pour détecter et suivre les personnes, `face-recognition` pour comparer les visages inscrits dans `faces/`, et une ligne virtuelle pour produire `ENTRY` ou `EXIT`.

```bash
cd packages/vision
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
copy config.example.yaml config.yaml
python main.py --config config.yaml --display
```

Les photos doivent être nommées avec l’identifiant UUID de l’étudiant, par exemple `faces/<student-id>.jpg`. Une identité inconnue, une confiance faible ou un franchissement non confirmé ne produit aucun événement. Les événements envoyés à `POST /api/vision/events` portent un `eventId` et sont idempotents.
