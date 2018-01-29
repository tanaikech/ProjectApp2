ProjectApp2
=====

<a name="TOP"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="Overview"></a>
# Overview
**This is a GAS project library for Google Apps Script (GAS). This library can be used for the projects of both standalone script type and container-bound script type.**

<a name="Description"></a>
# Description
There are Class SpreadsheetApp and Class DocumentApp for operating spreadsheet and document, respectively. But there is no Class for operating GAS project. If there is such Class ProjectApp, GAS project can be directly operated by GAS script. I thought that this will lead to new applications, and created [ProjectApp](https://github.com/tanaikech/ProjectApp). On the other hand, as a CLI tool for operating GAS project, there has already been [ggsrun](https://github.com/tanaikech/ggsrun).

Recently, by more update of Google, [Google Apps Script API](https://developers.google.com/apps-script/api/reference/rest/) was updated. By this, users got to be able to be more easily to manage the GAS projects. This was also reflected to this library. So I created ProjectApp2.

## Features
1. **Retrieve scripts in a project as Blob and JSON.**
1. **Create a project from Blob and JSON.**
1. **Update a project from Blob and JSON.**

For Blob, you can create new project from a file or several files on Google Drive. ProjectApp2 can use both [standalone script type](https://developers.google.com/apps-script/guides/standalone) and [container-bound script type](https://developers.google.com/apps-script/guides/bound) by updating [Google Apps Script API](https://developers.google.com/apps-script/api/reference/rest/).

# Library's project key
~~~
11qqgrTfCEydqwIF8RRrSZOrdq-KNsIDnUpnYefX5KobaMMArVSlXUqwS
~~~

# How to install
**This installation document is a simple. If you want to see the detail of installation, please click each link.**

1. [Install Library](https://developers.google.com/apps-script/guides/libraries) to Use ProjectApp2
    - Library's project key is **``11qqgrTfCEydqwIF8RRrSZOrdq-KNsIDnUpnYefX5KobaMMArVSlXUqwS``**.
    - **Please confirm that the identification of library is ``ProjectApp2``.**
1. Enable Drive API and Apps Script API at API console
    - On script editor
    - Resources -> Cloud Platform project
    - View API console
    - At Getting started, click Enable APIs and get credentials like keys.
    - At left side, click Library.
    - At Search for APIs & services, input **Drive API**. And click Google Drive API.
    - Click Enable button.
        - If it has already been enabled, please don't turn off.
    - At left side, click Library.
    - At Search for APIs & services, input **Apps script**. And click Google Apps Script API.
    - Click Enable button.
        - If it has already been enabled, please don't turn off.
1. **Also here [https://script.google.com/home/usersettings](https://script.google.com/home/usersettings) has to be enabled. Please turn ON.**

<u>Installing is done! You can use ProjectApp2.</u>

[In the case of an error related to scopes, please check here.](#QA)

### How to enable APIs directly
If you know project ID of the script that you use, you can directly access to the page to enable API using your browser.

- For Drive API
    - ``https://console.cloud.google.com/apis/api/drive.googleapis.com/?project=### project ID ###``
- For Apps Script API
    - ``https://console.cloud.google.com/apis/library/script.googleapis.com/?project=### project ID ###``

### About scopes
ProjectApp2 uses 2 scopes.

1. ``https://www.googleapis.com/auth/script.external_request``
1. ``https://www.googleapis.com/auth/script.projects``

These are provided from ProjectApp2 by Manifests. So users are not required to install these scopes.

# Usage
| Method | Return | Description |
|:------|:------|:------|
| getProjectInfo(projectId) | Object | Retrieve project information using project ID. The detail is [here](https://developers.google.com/apps-script/api/reference/rest/v1/projects#Project). |
| getProjectBlob(projectId, zip) | Blob[] | Retrieve scripts from a project as Blob[]. **Each blob means each script in a project.** Scripts are returned as an array like ``[blob, blob, blob, ...]``. The blob can be seen using [``getDataAsString()``](https://developers.google.com/apps-script/reference/base/blob#getDataAsString()) and [``DriveApp.createFile(blob)``](https://developers.google.com/apps-script/reference/drive/drive-app#createFile(BlobSource)). ``zip`` is a boolean. If ``zip`` is true, scripts are returned as blob of a zip file. |
| createProjectByBlob(projectname, blob, folderId) | Object | Create a project from Blob[]. **Each blob means each script in a project.** So if you have a script which is a file of sample.gs, you can use as a blob using ``DriveApp.getFileById("### file id of sample.gs ###").getBlob()``. |
| updateProjectByBlob(projectId, blob) | Object | Update existing project using Blob[]. **Each blob means each script in a project.** So if you have a script which is a file of sample.gs, you can use as a blob using ``DriveApp.getFileById("### file id of sample.gs ###").getBlob()``. |
| getProjectRaw(projectId) | Object[] | Retrieve scripts from a project as Object[]. The structure of Object[] is [here](https://developers.google.com/apps-script/guides/import-export#export_projects_from_drive). |
| createProjectByRaw(projectname, raw, folderId) | Object | Create a project from Object[]. The structure of Object[] is [here](https://developers.google.com/apps-script/guides/import-export#export_projects_from_drive). |
| updateProjectByRaw(projectId, raw) | Object | Update existing project using Object[]. The structure of Object[] is [here](https://developers.google.com/apps-script/guides/import-export#export_projects_from_drive). **In this method, all scripts in a project is overwritten by raw data (JSON).** |

You can also see the documents of library at the following URL.

[https://script.google.com/macros/library/versions/d/11qqgrTfCEydqwIF8RRrSZOrdq-KNsIDnUpnYefX5KobaMMArVSlXUqwS](https://script.google.com/macros/library/versions/d/11qqgrTfCEydqwIF8RRrSZOrdq-KNsIDnUpnYefX5KobaMMArVSlXUqwS)

## Samples
When you retrieve project information of a project, you can use scripts like below.

~~~javascript
var projectId = "#####";
var res = ProjectApp2.getProjectInfo(projectId);
Logger.log(res)
~~~

### Update existing project by blob
~~~javascript
var projectId = "#####";
var script1 = DriveApp.getFileById("### file id of sample.gs ###").getBlob();
var script2 = DriveApp.getFileById("### file id of sample.html ###").getBlob();
var blob = [script1, script2];
var res = ProjectApp2.updateProjectByBlob(projectId, blob);
Logger.log(res)
~~~

**If there is the same filename with the uploading script in the project, only the script is overwritten. Other scripts is not modified.**


### Create new project with special Manifests
~~~javascript
var json = {
  "timeZone": "Asia/Tokyo",
  "dependencies": {
    "enabledAdvancedServices": [{
      "userSymbol": "Drive",
      "serviceId": "drive",
      "version": "v2"
    }]
  },
  "exceptionLogging": "STACKDRIVER",
  "oauthScopes": [
    "https://www.googleapis.com/auth/drive"
  ]
};
var blob = Utilities.newBlob(JSON.stringify(json, null, "\t")).setName("appsscript.json");
var blob = [blob];
var res = ProjectApp2.createProjectByBlob("### Project name ###", blob, "### Folder ID ###");
// var res = ProjectApp2.updateProjectByBlob(projectId, blob); // If this is used, the Manifests in the existing project is updated.
Logger.log(res)
~~~

I think that a new installer can be created by using this.

# Applications using ProjectApp2
- [ManifestsApp](https://github.com/tanaikech/ManifestsApp)
- [RearrangeScripts](https://github.com/tanaikech/RearrangeScripts)

-----

<a name="Licence"></a>
# Licence
[MIT](LICENCE)

<a name="Author"></a>
# Author
[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="Update_History"></a>
# Update History
* v1.0.0 (January 29, 2018)

    Initial release.

[TOP](#TOP)
