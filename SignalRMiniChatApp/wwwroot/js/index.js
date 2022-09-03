$(document).ready(() => {
    const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7197/chathub").build();
    connection.start();
    connection.on("clientJoined", (nickName) => {
        durumDiv.html(`${nickName} giriş yaptı.`);
        animation();
    });
    connection.on("clients",
        clients => {
            const clientsDom = $(".clients");
            clientsDom.html("");
            $.each(clients,
                (index, item) => {
                    if (index == 0) {
                        clientsDom.append(`<a class="list-group-item list-group-item-action users active">${item.nickName}</a>`);
                    } else {
                        clientsDom.append(`<a class="list-group-item list-group-item-action users">${item.nickName}</a>`);
                    }

                });
            usersClick();
        });
    connection.on("receiveMessage", (message, nickName) => {
        const allMessageDom = $("#allMessage");
        allMessageDom.append(`<div class="list-group">
                                                <a class="list-group-item list-group-item-action message" aria-current="true">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <h5 class="my-1">${nickName}</h5>
                                                        <h5 class="my-1"></h5>
                                                    </div>
                                                    <p class="my-1 ">
                                                        ${message}
                                                    </p>
                                                </a>
                                            </div>`);
    });
    connection.on("groupsCreated",
        groups => {
            const roomsDom = $("#rooms");
            roomsDom.html("");
            //console.log(groups);
            $.each(groups,
                (index, item) => {
                    //console.log(item, "item bu");
                    roomsDom.append(`<option value="${item.groupName}">${item.groupName}</option>`);
                });
        });
    connection.onreconnecting((error) => {
        durumDiv.css("background-color", "blue");
        durumDiv.css("color", "white");
        durumDiv.html("Bağlantı kuruluyor..");
        animation();
    });
    connection.onreconnected((connectionId) => {
        durumDiv.css("background-color", "green");
        durumDiv.css("color", "white");
        durumDiv.html("Bağlantı kuruldu");
        animation();
    });
    connection.onclose((connectionId) => {
        durumDiv.css("background-color", "green");
        durumDiv.css("color", "white");
        durumDiv.html("Bağlantı kurulaamdı");
        animation();
    });

    $(".disabled").attr("disabled", "disabled");
    const durumDiv = $("#clientStatusMessages");
    let _groupName = "";
    document.querySelector(".users").addEventListener("click", usersClick());
    function animation() {
        durumDiv.fadeIn(2000, () => {
            setTimeout(() => {
                durumDiv.fadeOut(2000);
            }, 2000);
        });
    };
    function usersClick() {
        $(".users").click(function () {
            $(".users").each((index, item) => {
                item.classList.remove("active");
            });
            console.log(this, "bu işte");
            $(this).addClass("active");
        });
    }


    $("#btnGirisYap").click(() => {
        var disabledClass = document.querySelectorAll(".disabled");
        console.log(disabledClass);

        const nick = $("#txtNick").val();
        connection.invoke("GetNickName", nick).catch((error) => console.log(error));
        $(".disabled").removeAttr("disabled");
        $.each(disabledClass,
            (index, item) => {
                item.classList.remove('disabled');
            });
        $("#txtNick").attr("disabled", "");
        $("#btnGirisYap").attr("disabled", "disabled");
    });
    $("#btnSend").click(() => {
        const message = $("#txtMesaj").val();
        const clientName = $(".users.active").first().html();
        connection.invoke("SendMessageAsync", message, clientName);
        const allMessageDom = $("#allMessage");
        allMessageDom.append(`<div class="list-group">
                                                <a class="list-group-item list-group-item-action message" aria-current="true">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <h5 class="my-1"></h5>
                                                        <h5 class="my-1">~Siz</h5>
                                                    </div>
                                                    <p class="my-1 ">
                                                        ${message}
                                                    </p>
                                                </a>
                                            </div>`);
    });
    $("#btnCreateGroup").click(() => {
        const groupName = $("#groupName").val();
        connection.invoke("CreateGroup", groupName);
    });
    $("#btnEnterRoom").click(() => {
        let groupNames = [];
        $("#rooms option:selected").map((i, e) => {
            groupNames.push(e.innerHTML);
        });
        connection.invoke("AddClientToGroup", groupNames);

    });
    $("#rooms").change(function () {
        let groupName = $(this).val();
        _groupName = groupName[0];

        connection.invoke("GetClientsOfGroup", groupName[0]);
    });
    $("#btnSendToGroup").click(() => {

        const message = $("#txtMesaj").val();
        if (_groupName != "") {
            connection.invoke("SendMessageToGroupAsync", _groupName, message);
            const allMessageDom = $("#allMessage");
            allMessageDom.append(`<div class="list-group">
                                                <a class="list-group-item list-group-item-action message" aria-current="true">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <h5 class="my-1"></h5>
                                                        <h5 class="my-1">~Siz</h5>
                                                    </div>
                                                    <p class="my-1 ">
                                                        ${message}
                                                    </p>
                                                </a>
                                            </div>`);
        }
    });
});