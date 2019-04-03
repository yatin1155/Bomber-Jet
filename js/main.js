var toyModule = (function () {
    const $portletMain = $(".portletMain");
    const $attackBtn = $("#attackBtn");
    var myIntervalArray = [];
    let $bombElm = $(".bomb");

    var DirState = {    //State manager
        direction: "North",
        degree: 0,
        bit: null,
        x: null,
        y: null
    }

    let utils = {
        attack: () => {
            var planeDir = DirState.direction;
            var planePos = $(".plane").position();
            var parentWidth = $portletMain.width();
            var parentHeight = $portletMain.height();
            switch (planeDir) {
                case "North": //North
                    planePos.top -= 120;
                    break;
                case "South": //South
                    planePos.top += 120;
                    break;
                case "East": //East
                    planePos.left += 120;
                    break;
                case "West": //West
                    planePos.left -= 120;
                    break;
            }
            //rotate the explosion
            $bombElm.css("transform", "rotate(" + DirState.degree + "deg)");

            if ((planePos.top >= 0 && planePos.top < parentHeight) && (planePos.left >= 0 && planePos.left < parentWidth)) {
                $bombElm.css("top", planePos.top);
                $bombElm.css("left", planePos.left);
                $("#bombSound")[0].play();
                $(".bomb").removeClass("animate");
                $bombElm.addClass("animate");
                //clearing all the set Intervals
                for (var i = 0; i < myIntervalArray.length; ++i)
                    clearInterval(myIntervalArray[i]);

                myIntervalArray = [];

                myIntervalArray.push(
                    setTimeout(() => {
                        $(".bomb").removeClass("animate");
                    }, 2000)
                );
            }
        },
        updateDirection: () => {
            var previousDir = DirState.direction;
            var newDirection;
            switch (previousDir) {
                case "North":
                    if (DirState.bit === "Left") {
                        newDirection = "East"
                    } else if (DirState.bit === "Right") {
                        newDirection = "West"
                    }
                    break;
                case "South":
                    if (DirState.bit === "Left") {
                        newDirection = "West"
                    } else if (DirState.bit === "Right") {
                        newDirection = "East"
                    }
                    break;
                case "East":
                    if (DirState.bit === "Left") {
                        newDirection = "South"
                    } else if (DirState.bit === "Right") {
                        newDirection = "North"
                    }
                    break;
                case "West":
                    if (DirState.bit === "Left") {
                        newDirection = "North"
                    } else if (DirState.bit === "Right") {
                        newDirection = "South"
                    }
                    break;
            }
            DirState.direction = newDirection;
        },
        findCoordinates: () => {
            var tempX = DirState.x, tempY = DirState.y;

            if (tempX !== null && tempY !== null) {
                switch (DirState.direction) {
                    case "North": //North
                        tempY += 1;
                        break;
                    case "South": //South
                        tempY -= 1;
                        break;
                    case "East": //East
                        tempX += 1;
                        break;
                    case "West": //West
                        tempX -= 1;
                        break;
                }

                if (tempX >= 0 && tempX <= 9) {
                    DirState.x = tempX;
                }
                if (tempY >= 0 && tempY <= 9) {
                    DirState.y = tempY;
                }
            }

        },
        setCoordinates: (x, y) => {
            //update x & Y
            DirState.x = x;
            DirState.y = y;


            var parentWidth = $portletMain.width();
            var parentHeight = $portletMain.height();

            var top = parentHeight - ((y * 60) + 60);
            var left = (x * 60);

            if ((top >= 0)) {
                $(".plane").css("top", top);
            }

            if (left < parentWidth) {
                $(".plane").css("left", left);
            }


        },
        getControlsInfo: () => {
            $.confirm({
                title: 'Welcome TO Bomber Jet',
                theme: 'supervan',
                content: `<h4>Here's how to play:</h4> <br><br>
                Step 1  : Enter initial value for <b>X</b>, <b>Y</b>, <b>Position</b> and then click on <b> PLACE </b> button. <br> Step 2: Use the available controls and enjoy !.
                <br><br> <b>MOVE : </b>  Move the toy plane one unit forward in the direction it is currently facing.
                <br><b>LEFT : </b> Rotate the plane 90 degrees in the Left direction.
                <br><b>RIGHT : </b> Rotate the plane 90 degrees in the Right direction.
                <br><b>REPORT :</b> Notify the current positions of the plane.
                <br><b>ATTACK :</b>  Fire a projectile 2 units ahead of the current position.`,
                autoClose: 'cancelAction|10000',
                escapeKey: 'cancelAction',
                buttons: {
                    cancelAction: {
                        text: 'OK'
                    }
                }
            });
        },
        getInfo: () => {
            $.confirm({
                title: 'Current location of your Jet',
                theme: 'supervan',
                content: `
                <b>X coordinate :</b> ${DirState.x} <br>
                <b>Y Coordinate :</b> ${DirState.y} <br>
                <b>Current Poosition : <b>${DirState.direction}
                `,
                autoClose: 'cancelAction|10000',
                escapeKey: 'cancelAction',
                buttons: {
                    cancelAction: {
                        text: 'OK'
                    }
                }
            });
        },
        setDirection: (dirPart) => {
            var $plane = $(".plane");
            switch (dirPart) {
                case "North": //North
                    DirState.degree = 0;
                    $plane.css({ "transform": " rotate(0deg)" });
                    break;
                case "South": //South
                    DirState.degree = 180;
                    $plane.css({ "transform": "rotate(180deg)" });
                    break;
                case "East": //East
                    DirState.degree = 90;
                    $plane.css({ "transform": "rotate(90deg)" });
                    break;
                case "West": //West
                    DirState.degree = 270;
                    $plane.css({ "transform": "rotate(270deg)" });
                    break;
            }

            DirState.direction = dirPart;
        },
        onPosEvents: () => {
            $(document).keydown(function (e) {

                switch (e.which) {
                    case 37: // left
                        $("#leftBtn").trigger("click");
                        break;
                    case 38: // up
                        $("#moveBtn").trigger("click");
                        break;
                    case 39: // ri ght
                        $("#rightBtn").trigger("click");
                        break;
                    case 40: // down
                        $attackBtn.trigger("click");
                        break;

                }
            });
        },
        positionOverlayLogic: () => {
            $.confirm({
                title: 'Position your Jet',
                theme: 'supervan',
                content: `
                <form>
                    <div class="form-group">
                        <label for="xPart">X Coordinate</label>
                        <input type="text" class="form-control" id="xPart" placeholder="Enter X Coordinate..." required>
                        <p>Note: Value must be between 0 to 9.</p>
                    </div>
                    <div class="form-group">
                        <label for="yPart">Y Coordinate</label>
                        <input type="text" class="form-control" id="yPart" placeholder="Enter Y Coordinate..." required>
                        <p>Note: Value must be between 0 to 9.</p>
                    </div>
                    <div class="form-group">
                        <label for="dirPart">Direction</label>
                        <select class="form-control" id="dirPart">
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
                        <p>Note: North, South, East and West are the only valid directions.</p>
                    </div>
                </form>`,
                buttons: {
                    Submit: {
                        text: 'Submit',
                        btnClass: 'btn-orange',
                        action: function () {
                            var errorMsg = [];
                            var dir = ["North", "South", "East", "West"];
                            var status = false;
                            var inputX = (this.$content.find('input#xPart')).val().trim();
                            var inputY = (this.$content.find('input#yPart')).val().trim();
                            var inputDirection = (this.$content.find('select#dirPart')).val().trim();
                            // validation logic
                            if (isNaN(parseInt(inputX)) || parseInt(inputX) === 10 || parseInt(inputX) < 0  || (+inputX) - Math.floor(+inputX) !== 0) {
                                errorMsg.push("X Coordinate");
                            } else {
                                if (isNaN(parseInt(inputY)) || parseInt(inputY) === 10 || parseInt(inputY) < 0 || (+inputY) - Math.floor(+inputY) !== 0) {
                                    errorMsg.push("Y Coordinate");
                                } else {
                                    if (dir.includes(inputDirection)) {
                                        status = true;
                                    } else {
                                        errorMsg.push("Direction");
                                    }
                                }
                            }

                            if (status) {
                                $(".extraBtnGorup").css("display", "block");
                                //key board keys event
                                utils.onPosEvents();
                                utils.setCoordinates(+inputX, +inputY);
                                utils.setDirection(inputDirection);
                            } else {
                                $.alert({
                                    content: `
                                    Please enter valid <b> ${errorMsg.join(",")} </b> value.
                                    `,
                                    type: 'red'
                                });
                                return false;
                            }

                            return true;
                        }
                    },
                    Cancel: function () {
                        // do nothing.
                    }
                }
            });
        }
    };

    let eventListeners = () => {

        $("#leftBtn").off("click")
        $("#leftBtn").on("click", () => {

            var previousAngle = DirState.degree;
            // update direction
            //update degree

            previousAngle += 90;
            DirState.degree = previousAngle;
            $(".plane").css({ "transform": " rotate(" + previousAngle + "deg)" });
            DirState.bit = "Left";
            utils.updateDirection();

        });

        $("#rightBtn").off("click")
        $("#rightBtn").on("click", () => {

            var previousAngle = DirState.degree;
            // update direction
            //update degree

            previousAngle -= 90;
            DirState.degree = previousAngle;
            $(".plane").css({ "transform": " rotate(" + previousAngle + "deg)" });
            DirState.bit = "Right";
            utils.updateDirection();
        });

        $("#moveBtn").off("click")
        $("#moveBtn").on("click", () => {

            utils.findCoordinates();
            utils.setCoordinates(DirState.x, DirState.y);

        });
        $attackBtn.off("click")
        $attackBtn.on("click", () => {

            utils.attack();

        });

        $("#reportBtn").off("click")
        $("#reportBtn").on("click", () => {

            utils.getInfo();

        });

        $("#placeModal").off("click");
        $("#placeModal").on("click", () => {

            utils.positionOverlayLogic();

        });
    };

    var init = () => {

        $portletMain.css({ "background-image": " url(./images/grass2.jpg)" });

        // for initial info
        utils.getControlsInfo();

        //set Initial values
        utils.setCoordinates(0, 0);


        eventListeners();
    };

    return {
        init
    }

})();

toyModule.init();

