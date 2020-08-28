module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let sasURL = await GetSAS('taskcontainer');


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: sasURL
    };

};

var azure = require('azure-storage');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
async function GetSAS(containerName) {
    var blobService = azure.createBlobService(connectionString);

    blobService.createContainerIfNotExists(containerName, {
        publicAccessLevel: 'blob'
    }, function (error, result, response) {
        if (!error) {
            // if result = true, container was created.
            // if result = false, container already existed.           
        }
    });

    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        }
    };

    var token = blobService.generateSharedAccessSignature(containerName, undefined, sharedAccessPolicy);
    var sasUrl = blobService.getUrl(containerName, undefined, token);
    return sasUrl;
}