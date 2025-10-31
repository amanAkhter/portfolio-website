# 🎮 Easter Eggs Documentation

This document describes all the hidden easter eggs in the portfolio website and how to discover them. **All achievements can be unlocked on both PC and mobile devices!**

## 🏆 Achievement System

The website features a hidden achievement system with **7 unlockable achievements**. Your progress is saved locally and persists across sessions.

### Viewing Your Progress

Look for a small badge in the **bottom-left corner** of the page showing your achievement count (e.g., "3/7"). Hover over it to see the full list of achievements and which ones you've unlocked.

---

## 🎯 All Easter Eggs

### 1. 🚀 Konami Code Master
**How to unlock:** 
- **PC:** Enter the classic Konami Code on your keyboard:
  ```
  ↑ ↑ ↓ ↓ ← → ← → B A
  ```
  (Arrow keys, then B, then A)
- **Mobile:** Use an external keyboard with the same key sequence

**What happens:** The page will flash with rainbow colors for 3 seconds!

**Compatibility:** ✅ PC | ✅ Mobile (with keyboard)

---

### 2. ⭐ Space Explorer
**How to unlock:** Scroll through the entire portfolio website.

**Details:** Scroll at least **20,000 pixels** total OR reach the bottom of the page.

**Tip:** You can scroll slowly and explore at your own pace - reaching the bottom counts!

**Compatibility:** ✅ PC | ✅ Mobile | ✅ Tablet

---

### 3. ⚡ Speed Demon  
**How to unlock:** 
- **PC:** Triple-click anywhere quickly (within 500ms)
- **Mobile:** Triple-tap anywhere quickly

**Compatibility:** ✅ PC | ✅ Mobile | ✅ Tablet

---

### 4. ❤️ Patient Visitor
**How to unlock:** Stay on the website for 3 minutes.

**Compatibility:** ✅ PC | ✅ Mobile | ✅ Tablet

---

### 5. 💻 Secret Hacker
### 5. 💻 Secret Hacker
**How to unlock:** Discover the hidden secret through exploration.

**Details:** Multiple ways to unlock this achievement:

**Method 1 - Type the Code (PC/Tablet):**
- Type the secret code: `portfolio-master`
- Works anywhere on the site

**Method 2 - Click Logo (PC):**
- Click the **logo** or **"MY PORTFOLIO"** text in the navbar **5 times** quickly
- Must be within 3 seconds

**Method 3 - Long Press Profile (Mobile/Tablet):**
- Press and hold the **profile image** on the home page for **2 seconds**

**Method 4 - Navigation Sequence (Mobile/Tablet):**
- Tap navigation links in order: **Home → About → Projects → Contact**
- Must complete within 10 seconds

**Tip:** Explore the interface and interact with different elements to discover the secret!

**Compatibility:** ✅ PC | ✅ Mobile | ✅ Tablet

---

### 6. 📱 Shake Master
**How to unlock:** 
- **Mobile:** Shake your device vigorously
- **PC:** Press the **'S' key 5 times quickly** (within 1 second)

**What happens:** Achievement unlocked!

**Compatibility:** ✅ PC | ✅ Mobile

**Tip:** 
- Mobile: Shake firmly but safely!
- PC: Press 'S' rapidly 5 times for "Shake"

---

### 7. 👆 Quick Tapper
**How to unlock:** 
- **Mobile:** Double-tap anywhere quickly (within 300ms)
- **PC:** Double-click anywhere on the page

**Compatibility:** ✅ PC | ✅ Mobile | ✅ Tablet

---

## 🎨 Visual Effects

### Mouse Particle Trail
**Location:** Landing page
**Effect:** Colorful particles follow your mouse
**Compatibility:** PC with mouse

### Interactive Space Particles
**Location:** Landing page background
**Effect:** Stars, planets, and comets react to mouse movement
**Compatibility:** All devices

### Advanced Animations
- **Tilt Cards** - 3D tilt on hover
- **Holographic Shimmer** - Image shimmer effects
- **Glitch Text** - Cyberpunk text effects
- **Neon Borders** - Glowing borders
- **Scroll Reveal** - Elements fade in on scroll

---

## 💾 Progress Tracking

- Saved in browser localStorage
- Persists across sessions  
- Clear browser data to reset
- **Cross-device:** Progress is device-specific (not synced between devices)

---

## 🎯 Tips for Achievement Hunters

1. **All achievements work on both PC and mobile!**
2. Be patient - some need time (Patient Visitor)
3. Explore thoroughly - scroll everywhere (Space Explorer)
4. Try keyboard alternatives on PC for mobile-focused achievements
5. Check the bottom-left counter to track progress
6. Hover over the counter to see which achievements you're missing
7. Some achievements can be re-triggered after a cooldown period

---

## 📝 Quick Reference Table

| Achievement | PC Method | Mobile/Tablet Method |
|------------|-----------|----------------------|
| 🚀 Konami Code Master | ↑↑↓↓←→←→BA | External keyboard |
| ⭐ Space Explorer | Scroll 20,000px OR reach bottom | Scroll 20,000px OR reach bottom |
| ⚡ Speed Demon | Triple-click | Triple-tap |
| ❤️ Patient Visitor | Wait 3 minutes | Wait 3 minutes |
| 💻 Secret Hacker | Type code / Click logo 5x | Long-press profile / Tap nav sequence |
| 📱 Shake Master | Press 'S' 5x fast | Shake device |
| 👆 Quick Tapper | Double-click | Double-tap |

---

**Happy Hunting! 🎮✨🚀**

*All achievements are now accessible from both PC and mobile devices!*

*Last Updated: November 2025*

---

## 🔒 Security Implementation

To ensure fair play and prevent cheating, the achievement system includes multiple layers of security:

### Anti-Tampering System

The easter egg system uses a **cryptographic signature-based approach** to prevent users from manually editing localStorage to unlock achievements. This implementation is **completely client-side** and requires no database.

### 🛡️ Security Layers

#### 1. **Cryptographic Signature Verification**
Each achievement list is signed with a secret key using a custom hash function:
```typescript
// Signature generation
const generateSignature = (data: string[]): string => {
  const sortedData = [...data].sort().join('|');
  const combined = `${sortedData}:${SECRET_KEY}`;
  
  // Custom hash function (32-bit integer hash)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};
```

#### 2. **Timestamp-Based Validation**
Every achievement unlock is timestamped to detect suspicious patterns:
- **Speed Detection**: Flags if all 7 achievements are unlocked in less than 10 seconds
- **Time Range Validation**: Rejects timestamps in the future or more than 1 year in the past
- **Count Matching**: Ensures timestamp count matches achievement count

```typescript
const validateTimestamps = (timestamps: AchievementTimestamp[]): boolean => {
  // Check if achievements unlocked suspiciously fast
  if (timestamps.length >= 7) {
    const times = timestamps.map(t => t.timestamp).sort();
    const duration = times[times.length - 1] - times[0];
    if (duration < 10000) return false; // Less than 10 seconds = suspicious
  }
  
  // Validate timestamp ranges
  const now = Date.now();
  for (const t of timestamps) {
    if (t.timestamp > now + 60000) return false; // Future timestamp
    if (t.timestamp < now - 31536000000) return false; // > 1 year old
  }
  
  return true;
};
```

#### 3. **Automatic Tamper Detection & Reset**
When tampering is detected:
1. Console warning is logged
2. All achievement data is cleared
3. Signatures and timestamps are removed
4. User must unlock achievements legitimately

```typescript
const loadAchievements = (): string[] => {
  const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
  const signature = localStorage.getItem('achievementSignature');
  
  // Verify signature
  if (!verifySignature(achievements, signature)) {
    console.warn('Achievement tampering detected. Resetting.');
    clearAllAchievementData();
    return [];
  }
  
  // Verify timestamps
  if (!validateTimestamps(timestamps)) {
    console.warn('Suspicious pattern detected. Resetting.');
    clearAllAchievementData();
    return [];
  }
  
  return achievements;
};
```

### 📊 Data Structure

The system stores three pieces of data in localStorage:

1. **unlockedAchievements**: Array of achievement IDs
   ```json
   ["konami", "explorer", "speedster"]
   ```

2. **achievementSignature**: Cryptographic hash
   ```json
   "a7x9k2m"
   ```

3. **achievementTimestamps**: Unlock timestamps
   ```json
   [
     {"id": "konami", "timestamp": 1730419200000},
     {"id": "explorer", "timestamp": 1730419500000},
     {"id": "speedster", "timestamp": 1730419800000}
   ]
   ```

### 🎯 What This Prevents

❌ Manually adding achievements to localStorage  
❌ Editing the achievement array directly  
❌ Unlocking all achievements at once  
❌ Using fake or manipulated timestamps  
❌ Modifying completion status without valid data  

### ✅ What Users Can Still Do

✅ Remove achievements (they're removed from signed list properly)  
✅ Clear localStorage completely to reset progress  
✅ Earn achievements naturally through legitimate gameplay  
✅ View achievement progress in the UI  

### 🔐 Security Benefits

- **No Database Required**: All validation happens client-side
- **Transparent**: Legitimate users aren't affected
- **Automatic**: No manual intervention needed
- **Fair Play**: Ensures everyone earns achievements legitimately
- **Privacy-Friendly**: No personal data or tracking

### 💡 Technical Details

**Hash Algorithm**: Custom 32-bit integer hash with bitwise operations  
**Storage**: Browser localStorage (signed and timestamped)  
**Validation**: On every page load and achievement unlock  
**Reset Mechanism**: Automatic on tampering detection  

This multi-layered approach ensures that achievements remain meaningful and can only be earned through genuine interaction with the portfolio's easter eggs! 🎮🔒✨

---

## 🌐 Development & Testing

### LAN Network Access

The Vite development server is configured to allow access from other devices on your local network (LAN). This is useful for testing easter eggs and responsiveness on actual mobile devices.

**Configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,       // Default Vite port
    open: true,       // Auto-open browser
    cors: true,       // Enable CORS
    strictPort: false // Try next port if 5173 is busy
  }
})
```

**How to Access:**

1. **Start the dev server:**
   ```bash
   pnpm run dev
   ```

2. **Find your network URL:**
   The terminal will display something like:
   ```
   VITE v5.x.x  ready in 500 ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.100:5173/
   ```

3. **Access from mobile/tablet:**
   - Open browser on your mobile device
   - Enter the Network URL (e.g., `http://192.168.1.100:5173/`)
   - Make sure both devices are on the same Wi-Fi network

**Benefits:**
- ✅ Test mobile easter eggs (shake, long-press, double-tap) on real devices
- ✅ Verify responsive design on various screen sizes
- ✅ Test touch interactions authentically
- ✅ Debug network-related issues

**Security Note:** The `0.0.0.0` host binding is for development only and should not be used in production.

---

*Security implementation added: November 2025*
*LAN access configuration added: November 2025*
