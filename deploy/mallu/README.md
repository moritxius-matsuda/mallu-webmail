# mallu Webmail

Fork von [Bulwark Webmail](https://github.com/bulwarkmail/webmail) im Design von [mal.lu](https://mal.lu). Lizenz wie das Original: AGPL-3.0. Der vollständige Quellcode dieses Forks liegt öffentlich in diesem Repository.

## Was der Fork ändert

| Datei | Änderung |
| --- | --- |
| `lib/theme-mallu.ts` | Theme „mallu“: Farben der Website, eckige Formen, Skin von „Flat fields“ übernommen |
| `lib/builtin-themes.ts` | Theme „mallu“ registriert |
| `lib/admin/types.ts` | „mallu“ ist Standard-Theme, Link „Kundenpanel“ in der Seitenleiste |
| `app/(main)/layout.tsx` | Schriften Instrument Sans, Schibsted Grotesk, JetBrains Mono |
| `public/branding/mallu-*.svg` | Logos und Bildmarke |
| `lib/__tests__/builtin-themes.test.ts` | erwartet 8 statt 7 Themes |
| `deploy/mallu/` | diese Anleitung, Compose, Caddy, Einstellungen |

Alles andere ist unverändert. So bleiben Updates einfach (siehe unten).

## Betrieb unter webmail.mal.lu

Läuft auf einem eigenen kleinen Server, damit Port 443 der Mailserver frei bleibt. Im Oracle Free Tier passt der zweite `VM.Standard.E2.1.Micro` (AMD, 1 GB), Ubuntu 24.04, Region Frankfurt.

### 1. Stalwart vorbereiten (einmalig)

Bulwark spricht aus dem Browser direkt mit Stalwart. Dafür muss Stalwart fremde Webseiten zulassen:

- WebUI › Settings › Network › HTTP › Security › **Permissive CORS policy** einschalten
- oder `stalwart-cli update Http --field usePermissiveCors=true` und `stalwart-cli create Action/ReloadSettings`

### 2. Server anlegen

1. In Oracle eine `VM.Standard.E2.1.Micro` mit Ubuntu 24.04 anlegen, Name `webmail`.
2. Security List: TCP 80 und 443 für `0.0.0.0/0` freigeben.
3. Auf dem Server die Oracle-Sperre in `iptables` lösen und Docker installieren:

```bash
sudo iptables -I INPUT 5 -p tcp -m multiport --dports 80,443 -j ACCEPT
sudo netfilter-persistent save
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
curl -fsSL https://get.docker.com | sudo sh
```

### 3. DNS

`webmail.mal.lu` als A-Eintrag auf die öffentliche IP des Servers. Bei Cloudflare **nicht** über den Proxy (graue Wolke), sonst bekommt Caddy kein Zertifikat.

### 4. Starten

```bash
sudo mkdir -p /opt/webmail && cd /opt/webmail
# docker-compose.yml, Caddyfile und mallu.env aus deploy/mallu/ hierher kopieren
openssl rand -hex 32 | sudo tee session_secret >/dev/null && sudo chmod 600 session_secret
sudo docker compose up -d
sudo docker compose logs -f webmail
```

Danach `https://webmail.mal.lu` öffnen. Beim ersten Start legt Bulwark ein Admin-Passwort fest: Den Einrichtungscode zeigt `docker compose logs webmail`.

### 5. Updates

```bash
cd /opt/webmail && sudo docker compose pull && sudo docker compose up -d
```

## Den Fork aktuell halten

```bash
git remote add upstream https://github.com/bulwarkmail/webmail.git   # einmalig
git fetch upstream
git merge upstream/main          # Konflikte sind fast nur in den Dateien der Tabelle oben möglich
npx vitest run lib/__tests__/theme-contrast.test.ts lib/__tests__/builtin-themes.test.ts
git push
```

Der Push baut über GitHub Actions (`docker-publish.yml`) ein neues Image für amd64 und arm64: `ghcr.io/moritxius-matsuda/mallu-webmail-beta`. Das Paket muss in GitHub einmal auf „Public“ gestellt werden, sonst braucht der Server ein Login für ghcr.io.

## Bekannte Grenzen

- **Anmeldesperre nach IP:** Bulwark prüft Anmeldungen auch vom eigenen Server aus. Stalwart sieht dabei die IP des Webmail-Servers, nicht die des Kunden. Häufen sich Fehlversuche, kann Stalwart diese eine IP sperren und damit alle Webmail-Anmeldungen. Abhilfe: die IP des Webmail-Servers in Stalwart von der automatischen Sperre ausnehmen. `X-Forwarded-For` in Stalwart einzuschalten ist hier keine gute Idee, weil Browser Stalwart auch direkt erreichen und die Adresse dann fälschen könnten.
