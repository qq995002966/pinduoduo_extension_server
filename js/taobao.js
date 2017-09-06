console.log("我是set_user_taobao");
var name;
var mobile;
var address;

document.getElementsByClassName("modify")[0].click();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.type == "popup_setUserInfoTaoBao") {
            //用户点击popup页面的中  复制到淘宝按钮
            //需要做的,1.向background请求 userInfo
            //设置userInfo
            console.log("setUserInfoTaoBao");

            //需要做的,1.向background请求 userInfo
            chrome.runtime.sendMessage({type: "taobao_getUserInfo"}, function (response) {
                name = response.name;
                mobile = response.phone;
                address = response.address;

                console.log(name);
                console.log(mobile);
                console.log(address);

                setTaoBaoUserInfo(name, mobile, address);
            });
        } else if (request.type == "background_setUserInfo") {
            name = request.name;
            mobile = request.phone;
            address = request.address;

            console.log(name);
            console.log(mobile);
            console.log(address);

            setTaoBaoUserInfo(name, mobile, address);

            sendResponse({farewell: "successful"});
        }
        sendResponse({farewell: "successful"});
    });

function setTaoBaoUserInfo(name, mobile, address) {
    if ((name == null) || (name == "") || (mobile == null) ||
        (mobile == "") || (address == null) || (address == "")) {
        alert("请先复制用户信息,再来粘贴.信息此时为空");
    } else {
        //此时用户数据没什么问题,尝试更改网页
        var frame = document.getElementsByClassName("add-addr-iframe")[0];
        var innerDoc = frame.contentDocument;

        innerDoc.getElementById("city-title").click();

        var nameElement = innerDoc.getElementsByName("fullName")[0];
        var mobileElement = innerDoc.getElementsByName("mobile")[0];
        var addressElement = innerDoc.getElementsByClassName("ks-combobox-input")[0];

        nameElement.value = name;
        mobileElement.value = mobile;
        addressElement.value = address;


        var province = "";
        if (address.charAt(0) == "黑") {
            province = address.substr(0, 3);
        } else {
            province = address.substr(0, 2);
        }
        console.log(province);

        var aElements = innerDoc.getElementsByTagName("a");
        for (var i = 0; i < aElements.length; i++) {
            if (aElements[i].innerText == province) {
                aElements[i].click();
                // break;
            }
        }
        innerDoc.getElementsByClassName("ks-combobox-input i-ta tsl")[0].click();
        innerDoc.getElementById("J_Street").blur();
       
        setTimeout(function(){
        	innerDoc.getElementById("J_SelectCode").click();
			innerDoc.getElementsByClassName(" btn  tsl")[0].click();
			setTimeout(function(){
        	document.getElementsByClassName("go-btn")[0].click();
        },500);
        },500);
        
    }
}