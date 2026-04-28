import * as THREE from 'three';

// ===== Scene Setup =====
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xE8DDD3);
scene.fog = new THREE.Fog(0xE8DDD3, 12, 25);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3.5, 8);
camera.lookAt(0, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ===== Lights =====
const ambientLight = new THREE.AmbientLight(0xFFF5E6, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xFFF0D0, 1.8);
sunLight.position.set(2, 6, 4);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 20;
sunLight.shadow.camera.left = -6;
sunLight.shadow.camera.right = 6;
sunLight.shadow.camera.top = 6;
sunLight.shadow.camera.bottom = -3;
scene.add(sunLight);

const fillLight = new THREE.PointLight(0xFFE0B2, 0.5, 15);
fillLight.position.set(-3, 4, 2);
scene.add(fillLight);

// ===== Materials =====
const mat = {
    wall: new THREE.MeshStandardMaterial({ color: 0xF5F0EB, roughness: 0.9 }),
    floor: new THREE.MeshStandardMaterial({ color: 0x8B6B4A, roughness: 0.7 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x7A5C3A, roughness: 0.6 }),
    cushion: new THREE.MeshStandardMaterial({ color: 0xE8E4E0, roughness: 1.0 }),
    fur: new THREE.MeshStandardMaterial({ color: 0x6B6B6B, roughness: 0.95 }),
    furLight: new THREE.MeshStandardMaterial({ color: 0xCCBBAA, roughness: 0.95 }),
    nose: new THREE.MeshStandardMaterial({ color: 0xFFB0C0, roughness: 0.5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }),
    ear: new THREE.MeshStandardMaterial({ color: 0x443333, roughness: 0.8 }),
    tail: new THREE.MeshStandardMaterial({ color: 0xD4C4B0, roughness: 0.7 }),
    pot: new THREE.MeshStandardMaterial({ color: 0xB87A4B, roughness: 0.6 }),
    potWhite: new THREE.MeshStandardMaterial({ color: 0xEEE8E0, roughness: 0.5 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x4A7C3A, roughness: 0.7 }),
    leafDark: new THREE.MeshStandardMaterial({ color: 0x3A5C2A, roughness: 0.7 }),
    banana: new THREE.MeshStandardMaterial({ color: 0xFFE135, roughness: 0.5 }),
    avocado: new THREE.MeshStandardMaterial({ color: 0x568203, roughness: 0.6 }),
    broccoli: new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 }),
    brush: new THREE.MeshStandardMaterial({ color: 0xC4A66A, roughness: 0.5 }),
    sponge: new THREE.MeshStandardMaterial({ color: 0xFFD54F, roughness: 0.9 }),
    window: new THREE.MeshStandardMaterial({ color: 0xDDEEFF, roughness: 0.1, transparent: true, opacity: 0.3 }),
    windowFrame: new THREE.MeshStandardMaterial({ color: 0xF0EBE5, roughness: 0.5 }),
    rug: new THREE.MeshStandardMaterial({ color: 0x8B3A3A, roughness: 0.95 }),
};

// ===== Room =====
// Back wall
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), mat.wall);
backWall.position.set(0, 3, -3);
backWall.receiveShadow = true;
scene.add(backWall);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 14), mat.floor);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

// Rug
const rug = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), mat.rug);
rug.rotation.x = -Math.PI / 2;
rug.position.set(0, -0.48, 3);
rug.receiveShadow = true;
scene.add(rug);

// ===== Window =====
function createWindow() {
    const group = new THREE.Group();
    const frameThick = 0.08;
    // Outer frame
    const frameMat = mat.windowFrame;
    const createBar = (w, h, d) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);

    const top = createBar(3.2, frameThick, 0.1); top.position.set(0, 1.5, 0);
    const bot = createBar(3.2, frameThick, 0.1); bot.position.set(0, -1.5, 0);
    const left = createBar(frameThick, 3, 0.1); left.position.set(-1.6, 0, 0);
    const right = createBar(frameThick, 3, 0.1); right.position.set(1.6, 0, 0);
    const mid = createBar(3.2, frameThick, 0.1); mid.position.set(0, 0, 0);

    [top, bot, left, right, mid].forEach(b => group.add(b));

    // Glass
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 2.9), mat.window);
    glass.position.z = -0.02;
    group.add(glass);

    // Window sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.4), frameMat);
    sill.position.set(0, -1.55, 0.15);
    sill.castShadow = true;
    group.add(sill);

    group.position.set(0, 4.2, -2.95);
    return group;
}
scene.add(createWindow());

// ===== Table =====
const tableTop = new THREE.Mesh(new THREE.BoxGeometry(7, 0.15, 2.5), mat.wood);
tableTop.position.set(0, 0.8, 0);
tableTop.castShadow = true;
tableTop.receiveShadow = true;
scene.add(tableTop);

// ===== Cushion =====
function createCushion() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.3, 32), mat.cushion);
    base.castShadow = true;
    group.add(base);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.2, 12, 32), mat.cushion);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.1;
    rim.castShadow = true;
    group.add(rim);
    group.position.set(-0.3, 1.05, 0);
    return group;
}
scene.add(createCushion());

// ===== Opossum =====
let opossum;
const opossumReactions = {
    banana: ['냠냠! 바나나 좋아! 🍌', '달콤해~! 😋'],
    avocado: ['아보카도다! 건강해지는 기분! 🥑', '부드럽고 맛있어! 💚'],
    broccoli: ['브로콜리... 음... 🥦', '야채도 먹어야지! 💪'],
    brush: ['빗질해주는 거야? 기분 좋아~ 🪥', '아 시원해~ ✨'],
    sponge: ['스펀지?! 이건 못 먹어! 🧽', '장난치는 거지?! 😤'],
};

function createOpossum() {
    const group = new THREE.Group();

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), mat.fur);
    body.scale.set(1.3, 0.9, 1.0);
    body.castShadow = true;
    group.add(body);

    // Belly
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), mat.furLight);
    belly.position.set(0, -0.1, 0.2);
    belly.scale.set(1.0, 0.7, 0.8);
    group.add(belly);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 10), mat.fur);
    head.position.set(0.65, 0.2, 0);
    head.scale.set(1.1, 0.9, 0.9);
    head.castShadow = true;
    group.add(head);

    // Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 8), mat.furLight);
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(0.97, 0.12, 0);
    group.add(snout);

    // Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat.nose);
    nose.position.set(1.12, 0.12, 0);
    group.add(nose);

    // Eyes
    [-1, 1].forEach(side => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), mat.eye);
        eye.position.set(0.82, 0.3, side * 0.18);
        group.add(eye);
        const eyeHighlight = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 6, 4),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        );
        eyeHighlight.position.set(0.84, 0.32, side * 0.17);
        group.add(eyeHighlight);
    });

    // Ears
    [-1, 1].forEach(side => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), mat.ear);
        ear.position.set(0.55, 0.48, side * 0.22);
        ear.scale.set(0.6, 1, 0.8);
        group.add(ear);
    });

    // Legs
    [[-0.3, -0.35, 0.25], [-0.3, -0.35, -0.25], [0.3, -0.35, 0.25], [0.3, -0.35, -0.25]].forEach(pos => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.25, 8), mat.fur);
        leg.position.set(...pos);
        leg.castShadow = true;
        group.add(leg);
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), mat.nose);
        paw.position.set(pos[0], pos[1] - 0.12, pos[2]);
        group.add(paw);
    });

    // Tail
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.6, 0, 0),
        new THREE.Vector3(-0.9, -0.1, 0.1),
        new THREE.Vector3(-1.1, -0.3, 0.2),
        new THREE.Vector3(-1.0, -0.5, 0.15),
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 12, 0.04, 6, false);
    const tail = new THREE.Mesh(tailGeo, mat.tail);
    tail.castShadow = true;
    group.add(tail);

    group.position.set(-0.3, 1.45, 0);
    group.rotation.y = -0.3;
    return group;
}
opossum = createOpossum();
scene.add(opossum);

// ===== Plants =====
function createPlant(potMat, x, y, z, scale = 1) {
    const group = new THREE.Group();
    // Pot
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.35, 12), potMat);
    pot.castShadow = true;
    group.add(pot);
    // Dirt
    const dirt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: 0x4A3520, roughness: 1 })
    );
    dirt.position.y = 0.16;
    group.add(dirt);
    // Leaves
    for (let i = 0; i < 5; i++) {
        const leafGeo = new THREE.SphereGeometry(0.15, 8, 6);
        const leafMesh = new THREE.Mesh(leafGeo, i % 2 === 0 ? mat.leaf : mat.leafDark);
        const angle = (i / 5) * Math.PI * 2;
        leafMesh.position.set(Math.cos(angle) * 0.12, 0.3 + Math.random() * 0.2, Math.sin(angle) * 0.12);
        leafMesh.scale.set(0.8, 1.2, 0.8);
        leafMesh.castShadow = true;
        group.add(leafMesh);
    }
    // Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6), mat.leafDark);
    stem.position.y = 0.25;
    group.add(stem);

    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    return group;
}

// Windowsill plants
scene.add(createPlant(mat.pot, -1.2, 2.72, -2.7, 0.8));
scene.add(createPlant(mat.potWhite, 0, 2.72, -2.7, 0.7));
scene.add(createPlant(mat.pot, 1.0, 2.72, -2.7, 0.9));

// Table plants
scene.add(createPlant(mat.potWhite, 2.8, 0.95, -0.3, 1.1));
scene.add(createPlant(mat.pot, -2.8, 0.95, 0.2, 1.0));

// Floor plant (big)
function createBigPlant(x, z) {
    const group = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.7, 12), mat.potWhite);
    pot.position.y = 0.35;
    pot.castShadow = true;
    group.add(pot);
    for (let i = 0; i < 8; i++) {
        const leafGeo = new THREE.SphereGeometry(0.25, 8, 6);
        const leafMesh = new THREE.Mesh(leafGeo, i % 2 === 0 ? mat.leaf : mat.leafDark);
        const angle = (i / 8) * Math.PI * 2;
        const h = 0.8 + Math.random() * 0.5;
        leafMesh.position.set(Math.cos(angle) * 0.3, h, Math.sin(angle) * 0.3);
        leafMesh.scale.set(0.7, 1.3, 0.7);
        leafMesh.castShadow = true;
        group.add(leafMesh);
    }
    group.position.set(x, -0.5, z);
    return group;
}
scene.add(createBigPlant(3.5, 0));
scene.add(createBigPlant(-3.5, -1));

// ===== Throwable Items =====
const thrownItems = [];
const clock = new THREE.Clock();

function createItemMesh(type) {
    let mesh;
    switch (type) {
        case 'banana': {
            const g = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.3, 6, 8), mat.banana);
            body.rotation.z = 0.3;
            g.add(body);
            mesh = g;
            break;
        }
        case 'avocado': {
            const g = new THREE.Group();
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), mat.avocado);
            body.scale.set(0.8, 1, 0.7);
            g.add(body);
            mesh = g;
            break;
        }
        case 'broccoli': {
            const g = new THREE.Group();
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.15, 6), mat.brush);
            stem.position.y = -0.08;
            g.add(stem);
            for (let i = 0; i < 5; i++) {
                const top = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat.broccoli);
                const a = (i / 5) * Math.PI * 2;
                top.position.set(Math.cos(a) * 0.06, 0.05, Math.sin(a) * 0.06);
                g.add(top);
            }
            mesh = g;
            break;
        }
        case 'brush': {
            const g = new THREE.Group();
            const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.3), mat.brush);
            g.add(handle);
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.1), mat.brush);
            head.position.z = 0.15;
            g.add(head);
            mesh = g;
            break;
        }
        case 'sponge': {
            mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.15), mat.sponge);
            break;
        }
        default:
            mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1), mat.banana);
    }
    return mesh;
}

function throwItem(type) {
    const mesh = createItemMesh(type);
    // Start from bottom of screen
    mesh.position.set(
        (Math.random() - 0.5) * 2,
        0.5,
        5
    );
    scene.add(mesh);

    const target = new THREE.Vector3(
        opossum.position.x + (Math.random() - 0.5) * 0.5,
        opossum.position.y + 0.2,
        opossum.position.z
    );

    thrownItems.push({
        mesh,
        type,
        startPos: mesh.position.clone(),
        targetPos: target,
        progress: 0,
        speed: 1.5 + Math.random() * 0.5,
        rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        ),
        done: false,
        fadeOut: false,
        fadeTimer: 0,
    });

    // Button animation
    const btn = document.querySelector(`.item-btn[data-item="${type}"]`);
    if (btn) {
        btn.classList.add('throwing');
        setTimeout(() => btn.classList.remove('throwing'), 600);
    }
}

function showReaction(type) {
    const reactions = opossumReactions[type];
    const text = reactions[Math.floor(Math.random() * reactions.length)];
    const bubble = document.getElementById('reaction-bubble');
    const textEl = document.getElementById('reaction-text');
    textEl.textContent = text;
    bubble.classList.remove('hidden');
    bubble.classList.add('visible');

    clearTimeout(bubble._timeout);
    bubble._timeout = setTimeout(() => {
        bubble.classList.remove('visible');
        bubble.classList.add('hidden');
    }, 2500);
}

// ===== Item Tray Event =====
document.querySelectorAll('.item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.item;
        throwItem(type);
    });
});

// ===== Animation =====
let time = 0;
const opossumBaseY = opossum.position.y;
let opossumJumping = false;
let opossumJumpTime = 0;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    time += delta;

    // Opossum idle breathing
    if (!opossumJumping) {
        opossum.position.y = opossumBaseY + Math.sin(time * 2) * 0.02;
        opossum.rotation.y = -0.3 + Math.sin(time * 0.8) * 0.1;
    } else {
        opossumJumpTime += delta;
        const jt = opossumJumpTime;
        opossum.position.y = opossumBaseY + Math.sin(jt * 8) * 0.15 * Math.max(0, 1 - jt);
        opossum.rotation.z = Math.sin(jt * 10) * 0.1 * Math.max(0, 1 - jt);
        if (opossumJumpTime > 1.2) {
            opossumJumping = false;
            opossumJumpTime = 0;
            opossum.rotation.z = 0;
        }
    }

    // Update thrown items
    for (let i = thrownItems.length - 1; i >= 0; i--) {
        const item = thrownItems[i];
        if (item.done) {
            if (item.fadeOut) {
                item.fadeTimer += delta;
                const s = Math.max(0, 1 - item.fadeTimer * 2);
                item.mesh.scale.setScalar(s);
                if (item.fadeTimer > 0.6) {
                    scene.remove(item.mesh);
                    thrownItems.splice(i, 1);
                }
            }
            continue;
        }

        item.progress += delta * item.speed;
        const t = Math.min(item.progress, 1);

        // Parabolic arc
        const arcHeight = 2.5;
        const currentPos = new THREE.Vector3().lerpVectors(item.startPos, item.targetPos, t);
        currentPos.y += Math.sin(t * Math.PI) * arcHeight;

        item.mesh.position.copy(currentPos);
        item.mesh.rotation.x += item.rotSpeed.x * delta;
        item.mesh.rotation.y += item.rotSpeed.y * delta;
        item.mesh.rotation.z += item.rotSpeed.z * delta;

        if (t >= 1) {
            item.done = true;
            item.fadeOut = true;
            // Trigger reaction
            opossumJumping = true;
            opossumJumpTime = 0;
            showReaction(item.type);
        }
    }

    // Gentle camera sway
    camera.position.x = Math.sin(time * 0.3) * 0.15;
    camera.lookAt(0, 1.2, 0);

    renderer.render(scene, camera);
}

// ===== Resize =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== Hide Loading =====
setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
}, 800);

animate();
