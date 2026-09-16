# Vision adapter

Ce package contient le moteur Python/OpenCV avec détection YOLO, reconnaissance par embeddings, suivi et franchissement de ligne.

Le moteur publie des événements normalisés :

## Installation Windows

Depuis PowerShell :

```powershell
.\setup.ps1
```

Puis placez les photos dans `faces/<student-id>.jpg` et lancez :

```powershell
.\run.ps1 -Display
```

```json
{
  "studentId": "uuid",
  "type": "ENTRY",
  "timestamp": "2026-09-15T08:00:00.000Z",
  "confidence": 0.98,
  "cameraId": "uuid",
  "source": "VISION"
}
```

L’API cible est `POST /api/movements`.
