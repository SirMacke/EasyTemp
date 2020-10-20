function logout(name) {
    document.cookie = name + "=" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    window.location.href = 'http://' + window.location.host;
}

var statistics = decodeURIComponent(document.cookie).split('; ').find(row => row.startsWith('statistics')).split('=')[1];
statistics = JSON.parse(statistics);

document.getElementById('dataCollected').innerHTML = statistics[0].toString();
document.getElementById('users').innerHTML = statistics[1].toString();
document.getElementById('admins').innerHTML = statistics[2].toString();