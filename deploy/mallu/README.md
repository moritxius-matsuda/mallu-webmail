# mallu Webmail

Fork von [Bulwark Webmail](https://github.com/bulwarkmail/webmail) im Design von [mal.lu](https://mal.lu). Lizenz wie das Original: AGPL-3.0. Der vollständige Quellcode dieses Forks liegt öffentlich in diesem Repository.

Das Webmail läuft als **Bulwark Lite direkt in Stalwart**, unter `https://mail.mal.lu/webmail/`. Stalwart liefert es auf beiden Mailservern aus, es braucht keinen eigenen Server und keinen eigenen Port.

## Was der Fork ändert

| Datei | Änderung |
| --- | --- |
| `lib/theme-mallu.ts` | Theme „mallu“: Farben der Website, eckige Formen, Skin von „Flat fields“ übernommen |
| `lib/builtin-themes.ts` | Theme „mallu“ registriert |
| `lib/admin/types.ts` | „mallu“ ist Standard-Theme |
| `app/(main)/layout.tsx` | Schriften Instrument Sans, Schibsted Grotesk, JetBrains Mono |
| `public/branding/mallu-*.svg` | Logos und Bildmarke |
| `scripts/lite/lib.mjs` | `LITE_EXTRA_CONFIG`: weitere Schlüssel für `config.json` aus einer Datei |
| `deploy/mallu/lite-config.json` | Branding für Lite: Logos, Links, „Kundenpanel“ als Kontoverwaltung |
| `deploy/mallu/build-lite.sh` | baut das Paket für Stalwart |
| `lib/__tests__/…` | Tests an das achte Theme und die neuen Schriften angepasst |

Alles andere ist unverändert. So bleiben Updates einfach (siehe unten).

## Paket bauen

```bash
bash deploy/mallu/build-lite.sh
```

Ergebnis: `dist-mallu/bulwark-lite-stalwart.zip` und die Prüfsumme `…zip.sha256`. Beides als Release in diesem Repository hochladen:

```bash
gh release create mallu-<version> dist-mallu/bulwark-lite-stalwart.zip dist-mallu/bulwark-lite-stalwart.zip.sha256 \
  --title "mallu Webmail <version>" --notes "Bulwark Lite für Stalwart im mallu-Design."
```

Release-Tags ohne `v` davor, zum Beispiel `mallu-1.21.0-1`.

## In Stalwart einbinden (einmalig)

WebUI › Settings › Web Applications › neue Application:

| Feld | Wert |
| --- | --- |
| Description | `mallu Webmail` |
| Resource URL | `https://github.com/moritxius-matsuda/mallu-webmail/releases/download/<tag>/bulwark-lite-stalwart.zip` |
| URL prefix | `/webmail` |

Danach **Update applications** ausführen. Das Anlegen allein bindet nichts ein. Mit der CLI:

```bash
stalwart-cli create Application --field description='mallu Webmail' \
  --field resourceUrl='https://github.com/moritxius-matsuda/mallu-webmail/releases/download/<tag>/bulwark-lite-stalwart.zip' \
  --field 'urlPrefix={"/webmail":true}'
stalwart-cli create Action/UpdateApps
```

Die Einstellung gilt für den ganzen Cluster. Jeder Mailserver lädt das Paket selbst herunter.

## Update auf eine neue Version

1. Neues Paket bauen und als neues Release hochladen.
2. In Stalwart bei der Application die Resource URL auf den neuen Tag ändern und **Update applications** ausführen.
3. Vorher die Prüfsumme des Downloads mit der `.sha256`-Datei vergleichen. Stalwart prüft das Paket nicht selbst.

## Den Fork aktuell halten

```bash
git remote add upstream https://github.com/bulwarkmail/webmail.git   # einmalig
git fetch upstream
git merge upstream/main          # Konflikte sind fast nur in den Dateien der Tabelle oben möglich
npx vitest run lib/__tests__/theme-contrast.test.ts lib/__tests__/builtin-themes.test.ts lib/__tests__/layout-
git push
```

## Bekannte Grenzen von Lite

- Kein Bulwark-Admin-Dashboard, keine Plugins, keine Web-Push-Benachrichtigungen, keine Office-Bearbeitung.
- Passwort ändern und Zwei-Faktor-Anmeldung im Webmail gehen auf Stalwart 1.0 nur mit einem eigenen OAuth-Client in Stalwart. Bis dahin führt „Kundenpanel“ in den Einstellungen zur Postfachverwaltung auf mal.lu.
- Die Dateien der Application bekommen von Stalwart keine Content-Security-Policy.
