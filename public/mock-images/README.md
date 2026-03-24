# Mock Images Setup - Detailed Specifications

This folder contains local images used for the mock data button in AmbiguityLens.

## Image Requirements (SPECIFIC)

### 1. **clear-command.jpg**
**What it should show:**
- A robotic arm (6-axis industrial arm or collaborative robot) **actively picking up 1-3 objects**
- Objects should be: small colored boxes, cubes, or cylindrical parts on a work surface
- Setting: Clean industrial/lab environment with a work table
- Action: Arm's gripper/end-effector holding or grasping the object(s)
- **Why:** Represents clear, specific robotic commands with defined actions

**Search keywords:**
- "industrial robot arm picking up objects"
- "ABB robot picking parts"
- "KUKA robotic arm manipulation"
- "collaborative robot picking cubes"

---

### 2. **ambiguous-command.jpg**
**What it should show:**
- A manufacturing/warehouse floor scene with **multiple robots and workstations**
- Objects scattered around, unclear organization
- Cluttered environment with various tools, parts, and machinery visible
- NOT a single focused robotic action - show complexity and ambiguity
- **Why:** Represents ambiguous commands ("move around the area", "grab approximately")

**Search keywords:**
- "factory floor with multiple robots"
- "manufacturing warehouse automation"
- "industrial robotics workstation cluster"
- "cluttered manufacturing environment"

---

### 3. **too-short.jpg**
**What it should show:**
- **Close-up of a robotic gripper/end-effector ONLY** (no arm visible)
- Types of grippers:
  - Parallel gripper (two fingers closing on object)
  - Vacuum gripper (suction cups)
  - Three-finger gripper
  - Magnetic gripper
- Show the gripper in its "open" or "idle" position
- Background should be neutral or blurred
- **Why:** Represents incomplete/too-short commands (just "Go" with no context)

**Search keywords:**
- "robotic gripper close-up"
- "parallel gripper mechanism"
- "industrial end-effector"
- "pneumatic robot gripper"
- "suction cup gripper"

---

### 4. **too-complex.jpg**
**What it should show:**
- **Complex multi-station setup** with:
  - 2+ robotic arms working together
  - Conveyor belts, assembly line components
  - Multiple work stations with different equipment
  - Many interconnected processes visible
  - Complex cable management, fixtures, tool changers
- Show visual chaos/complexity - many simultaneous operations
- **Why:** Represents overcomplicated commands with too many sub-tasks

**Search keywords:**
- "multi-robot assembly line"
- "complex manufacturing automation system"
- "industrial robotic cell multi-arm"
- "advanced factory automation setup"
- "FANUC multiple robot coordination"

---

### 5. **robotic-movement.jpg**
**What it should show:**
- **A robotic arm (specifically articulated/6-axis arm) in mid-motion**
- Arm should be clearly extended or in an interesting pose (NOT resting position)
- Types of arms:
  - KUKA, ABB, FANUC, or Stäubli industrial arms
  - Collaborative robot (cobot) like Universal Robots
  - Articulated arm showing joint bending
- Motion blur or dynamic positioning (arm mid-movement, not static)
- Clear visibility of multiple arm segments/joints
- **Why:** Represents precise movement commands with specific parameters

**Search keywords:**
- "articulated robotic arm in motion"
- "KUKA KR robot dynamic"
- "universal robot motion"
- "6-axis robot arm extension"
- "industrial robot joint movement"
- "collaborative robot arm reaching"

---

## How to Download

### Best Sources (Ranked by Quality for Robotics)

1. **Unsplash** (unsplash.com)
   - Search: "industrial robot" or specific robot brand names
   - Filter: High resolution, landscape/square
   - **Best for:** Professional, high-quality images

2. **Pexels** (pexels.com)
   - Search: "manufacturing robot" or "factory automation"
   - Filter: High resolution preferred
   - **Good for:** Diverse robot types

3. **Pixabay** (pixabay.com)
   - Search: "robot arm" or "automation"
   - Filter: Highest resolution available
   - **Good for:** Free, no attribution needed

4. **Shutterstock** (shutterstock.com)
   - Paid but excellent robotics imagery
   - Try free trial or individual image credits

5. **iStock** (istockphoto.com)
   - Professional industrial/robotics photography
   - Paid service with good search filters

---

## Technical Specifications

| Property | Requirement |
|----------|-------------|
| **Format** | JPG, PNG, or WebP |
| **Dimensions** | 500 x 500 pixels (square) |
| **File Size** | < 200 KB per image |
| **Color Space** | RGB or sRGB |
| **Quality** | High resolution source (at least 1000x1000 before resizing) |

---

## File Structure After Download

```
AmbiguityLens/
├── public/
│   └── mock-images/
│       ├── README.md (this file)
│       ├── clear-command.jpg
│       ├── ambiguous-command.jpg
│       ├── too-short.jpg
│       ├── too-complex.jpg
│       └── robotic-movement.jpg
```

---

## Steps to Add Images

1. Download 5 images following the specifications above
2. Resize each to **500 x 500 pixels**
3. Convert to JPG format (for web optimization)
4. Rename them EXACTLY as listed above
5. Place them in `public/mock-images/`
6. Save and refresh the app - they'll appear automatically!

---

## Pro Tips

- **For JPG optimization:** Use any online tool like TinyJPG or ImageOptim
- **For resizing:** Use Photoshop, GIMP (free), or online tools like Pixlr
- **For verification:** Open each image in the browser to confirm it displays correctly
- **Backup:** Keep originals with descriptive names before renaming

---

## If You Can't Find Exact Matches

**Priority ranking (use these if exact images unavailable):**
1. ✅ Robot arm with clear action/movement
2. ✅ Industrial scene with visible automation
3. ✅ Any commercial gripper close-up
4. ✅ Multi-robot or complex setup
5. ⚠️ Any robotic equipment in professional environment

**Avoid:**
- ❌ Cartoon/rendered robots (need realistic)
- ❌ 3D CAD drawings (too artificial)
- ❌ Blurry or low-quality images
- ❌ Humanoid robots (need industrial/collaborative robots)


