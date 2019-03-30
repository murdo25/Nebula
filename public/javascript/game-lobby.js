window.onload = function() {

    setLoginClickListener();
}

function setLoginClickListener() {
    $("#login-form").submit(function(e) {
        e.preventDefault();
        let username = document.getElementById("username").value;
        $.post({
            url: "/login",
            data: { username },
            success: function(result) {
                if (result == true) {
                    sessionStorage.setItem("username", username);
                    console.log("session stored username " + username)
                    $.post({
                        url: "/game",
                        data: { username },
                        success: function(result) {
                            document.open();
                            document.write(result);
                            document.close();
                        }
                    });
                }
                else {
                    alert("Username is already taken...");
                }
            }
        });
    });
    return false;
}
