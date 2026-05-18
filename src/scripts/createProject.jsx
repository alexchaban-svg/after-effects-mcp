
function createProject(args) {
    try {
        // Create new project
        app.newProject();
        
        var response = {
            status: "success",
            message: "New project created successfully"
        };

        // If a savePath is provided, save the project there
        if (args.savePath) {
            var myFile = new File(args.savePath);
            
            // Ensure directory exists (AE doesn't create directories on save)
            // But we assume the folder is already created by the tool caller
            
            app.project.save(myFile);
            response.savedTo = args.savePath;
            response.message += " and saved to " + args.savePath;
        }

        return JSON.stringify(response, null, 2);
    } catch (error) {
        return JSON.stringify({
            status: "error",
            message: error.toString()
        }, null, 2);
    }
}

// Get arguments from the temp file (consistent with other scripts in this MCP)
var argsFile = new File($.fileName.replace(/[^\\\/]*$/, '') + "../temp/args.json");
var args = {};
if (argsFile.exists) {
    argsFile.open("r");
    var content = argsFile.read();
    argsFile.close();
    if (content) {
        try {
            args = JSON.parse(content);
        } catch (e) {
            $.write(JSON.stringify({
                status: "error",
                message: "Failed to parse arguments: " + e.toString()
            }, null, 2));
        }
    }
}

var result = createProject(args);
$.write(result);
