document.addEventListener("DOMContentLoaded", () => {

    let phase = 1;//
    const text = new SplitType(".name, .contact1, .contact2, .sectionTitle, .subTitle, .dateRange, .bullet, p", { types: "words" });
    const words = [...text.words];

    const { Engine, Runner, World, Bodies, Body, Events, Composite } = Matter;
    const engine = Engine.create({
        gravity: { x: 0, y: 0 },
    });
    const runner = Runner.create();
    Runner.run(runner, engine);

    let transitionIntervalId = null;
    let transitionTimeoutId = null;

    let floor;
    let rWall;
    let ceil;
    let lWall;
    let thickness = 1000;

    function initEnv() {



        floor = Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight + thickness / 2,
            window.innerWidth * 2,
            thickness,
            { isStatic: true }
        );
        World.add(engine.world, floor);

        ceil = Bodies.rectangle(
            window.innerWidth / 2,
            -thickness / 2,
            window.innerWidth * 2,
            thickness,
            { isStatic: true }
        );
        World.add(engine.world, ceil);

        lWall = Bodies.rectangle(
            -thickness / 2,
            window.innerHeight / 2,

            thickness,
            window.innerHeight * 2,

            { isStatic: true }
        );
        World.add(engine.world, lWall);

        rWall = Bodies.rectangle(
            window.innerWidth + thickness / 2,
            window.innerHeight / 2,

            thickness,
            window.innerHeight * 2,

            { isStatic: true }
        );
        World.add(engine.world, rWall);

        itemElements = [];
        itemBodies = [];

        words.forEach((word) => {
            const items = word.textContent.split(" ");
            const wordRect = word.getBoundingClientRect();
            const stickyRect = document
                .querySelector(".sticky")
                .getBoundingClientRect();

            word.style.opacity = 1;

            items.forEach((item, itemIndex) => {
                const itemSpan = document.createElement("span");
                itemSpan.className = "item";
                itemSpan.textContent = item;
                itemSpan.style.position = "absolute";
                itemSpan.style.font = getComputedStyle(word).font;
                document.querySelector(".sticky").appendChild(itemSpan);

                const itemWidth = word.offsetWidth / items.length;
                const x = wordRect.left - stickyRect.left + itemIndex * itemWidth;
                const y = wordRect.top - stickyRect.top;

                itemSpan.style.left = `${x}px`;
                itemSpan.style.top = `${y}px`;
                itemSpan.style.color = getComputedStyle(word).color;
                itemElements.push(itemSpan);

                const body = Bodies.rectangle(
                    x + itemWidth / 2,
                    y + itemSpan.offsetHeight / 2,
                    itemWidth * 1,
                    itemSpan.offsetHeight * 0.7, //(only for rectangle)
                    {
                        restitution: 1,
                        friction: 0.9,
                        frictionAir: 0.0175,
                        isStatic: true,
                    }
                );

                World.add(engine.world, body);
                itemBodies.push({
                    body,
                    element: itemSpan,
                    initialX: x,
                    initialY: y,
                    bodyX: x + itemWidth / 2,
                    bodyY: y + itemSpan.offsetHeight / 2,
                });
            });
        });
    }

    function startPhysicsAnim() {

        engine.gravity.y = 0;


        words.forEach((word) => {
            word.style.opacity = 0;
        });

        itemBodies.forEach(({ body, element }) => {
            body.collisionFilter.mask = 1;
            element.style.opacity = 1;
            element.style.color = "black";
            Body.setStatic(body, false);
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.001);
            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
            });
        });
    }

    function transition() {

        engine.gravity.y = 0;

        itemBodies.forEach(({ body, bodyX, bodyY }) => {

            body.collisionFilter.mask = 0;

            let pGain = -.05;
            let dGain = .1
            let angleGain = 0.05;

            let dx = body.position.x - bodyX;
            let dy = body.position.y - bodyY;

            Body.setAngularVelocity(body, -(body.angle % (Math.PI * 2)) * angleGain)

            let pidX = pGain * dx - dGain * body.velocity.x
            let pidY = pGain * dy - dGain * body.velocity.y

            Body.setVelocity(body, { x: pidX, y: pidY })
        });

    }

    function startPhysics() {
        engine.gravity.y = 0;
        itemBodies.forEach(({ body, element }) => {
            body.collisionFilter.mask = 1;
        });
    }

    function stopPhysics() {

        engine.gravity.y = 0;
        words.forEach((word) => {
            word.style.opacity = 1;
        });

        itemBodies.forEach(({ body, element }) => {
            element.style.opacity = 0;
            element.style.color = "black";
            Body.setStatic(body, false);
        });
    }

    function phase2Actions() {
        phase = 2;
        initEnv();
        startPhysicsAnim();
        enableMouseInteraction(); // Enable mouse interaction in phase 2
    }

    function phase3Actions() {
        phase = 3;

        disableMouseInteraction();

        transitionIntervalId = setInterval(transition, 10);
        transitionTimeoutId = setTimeout(phase5Actions, 3000);

    }

    function phase4Actions() {
        clearTimeout(transitionTimeoutId);
        clearInterval(transitionIntervalId);
        phase = 4;
        startPhysics();
        enableMouseInteraction();
    }

    function phase5Actions() {
        clearInterval(transitionIntervalId);
        phase = 5;
        stopPhysics();
        disableMouseInteraction();
    }

    function phase6Actions() {
        phase = 6;
        startPhysicsAnim();
        enableMouseInteraction();
    }

    function handleResize() {
        if (phase !== 1) {
            if (phase !== 5) {
            } else {
                initEnv();
            }
        }
    }

    function enableMouseInteraction() {
        window.addEventListener('mousemove', handleMouseMove);
    }

    function disableMouseInteraction() {
        window.removeEventListener('mousemove', handleMouseMove);
    }

    function handleMouseMove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        itemBodies.forEach(({ body }) => {
            const dx = mouseX - body.position.x;
            const dy = mouseY - body.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { // Adjust the interaction radius as needed
                const forceMagnitude = -0.0000002 * (100 - distance);
                Body.applyForce(body, body.position, {
                    x: dx * forceMagnitude,
                    y: dy * forceMagnitude,
                });
            }
        });
    }

    // Button 1 actions
    document.getElementById("enablePhysicsButton").addEventListener('click', () => {
        switch (phase) {
            case 1:
                phase2Actions();
                break;
            case 3:
                phase4Actions();
                break;
            case 5:
                phase6Actions();
                break;
            default:
                break;
        }
    });

    // Button 2 actions
    document.getElementById('disablePhysicsButton').addEventListener('click', () => {
        switch (phase) {
            case 2:
                phase3Actions();
                break;
            case 4:
                phase3Actions();
                break;
            case 6:
                phase3Actions();
                break;
            default:
                break;
        }
    });

    // Handle window resize event
    window.addEventListener('resize', handleResize);

    Events.on(engine, "afterUpdate", () => {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;

        Body.setPosition(floor, { x: winWidth / 2, y: winHeight + thickness / 2 })
        Body.setPosition(rWall, { x: winWidth + thickness / 2, y: winHeight / 2 })
        Body.setPosition(ceil, { x: winWidth / 2, y: -thickness / 2 })
        Body.setPosition(lWall, { x: -thickness / 2, y: winHeight / 2 })

        itemBodies.forEach(({ body, element, initialX, initialY }) => {
            const deltaX = body.position.x - (initialX + element.offsetWidth / 2);
            const deltaY = body.position.y - (initialY + element.offsetHeight / 2);
            element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${body.angle}rad)`;
        });
    });
});