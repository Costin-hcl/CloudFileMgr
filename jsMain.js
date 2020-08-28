function jsmain() {
    refreshContainer();
    showAuth();
}

function showAuth() {

    console.log(getUser());
}

async function getUser() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal.userDetails;
}

function getBlobService() {
      

        let account = "cloudfilemgrstorage";
        let sas = "sig=an0NerJSA3SXdKWYGZ4tzTpW9NOO0d6Cig%2Fwh7gdhcY%3D";

    blobUri = 'https://' + account + '.blob.core.windows.net/targetupload';
    var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, sas).withFilter(new AzureStorage.Blob.ExponentialRetryPolicyFilter());
    //withHeader("Access-Control-Allow-Origin", "*");
    return blobService;
}
function refreshContainer() {
    var blobService = getBlobService();
    if (!blobService)
        return;

    document.getElementById('containers').innerHTML = 'Loading...';
    blobService.listContainersSegmented(null, function (error, results) {
        if (error) {
            alert('List container error, please open browser console to view detailed error');
            console.log(error);
        } else {
            var output = [];
            output.push('<tr>',
                            '<th>ContainerName</th>',
                            '<th>ContainerETag</th>',
                            '<th>LastModified</th>',
                            '<th>Operations</th>',
                        '</tr>');
            if (results.entries.length < 1) {
                output.push('<tr><td>Empty results...</td></tr>');
            }
            for (var i = 0, container; container = results.entries[i]; i++) {
                output.push('<tr>',
                                '<td>', container.name, '</td>',
                                '<td>', container.etag, '</td>',
                                '<td>', container.lastModified, '</td>',
                                '<td>', '<button class="btn btn-xs btn-danger" onclick="deleteContainer(\'', container.name ,'\')">Delete</button> ',
                                        '<button class="btn btn-xs btn-success" onclick="viewContainer(\'', container.name ,'\')">Select</button>', '</td>',
                            '</tr>');
            }
            document.getElementById('containers').innerHTML = '<table class="table table-condensed table-bordered">' + output.join('') + '</table>';
        }
    });
}
