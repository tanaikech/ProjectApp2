/**
 * GitHub  https://github.com/tanaikech/ProjectApp2<br>
 *
 * Retrieve project information.<br>
 * @param {String} projectId projectId
 * @return {Object} Return JSON
 */
function getProjectInfo(projectId) {
    return new ProjectApp2().getProjectInfo(projectId);
}

/**
 * Retrieve project as blob.<br>
 * @param {String} projectId projectId
 * @param {Boolean} zip When this is used, a blob of zip which included blobs of scripts in project is returned.
 * @return {Object} Return blob which is 1 dimensional array.
 */
function getProjectBlob(projectId, zip) {
    return new ProjectApp2().getProjectBlob(projectId, (zip || null));
}

/**
 * Create project by blob.<br>
 * @param {String} projectname projectname
 * @param {Blob[]} blob blob
 * @param {String} parentId file ID of Google Docs. Create new project of bound script type by this. When this is not defined, new standalone project is created.
 * @return {Object} Return project information.
 */
function createProjectByBlob(projectname, blob, parentId) {
    return new ProjectApp2().createProjectByBlob(projectname, blob, (parentId || null));
}

/**
 * Update project by blob.<br>
 * @param {String} projectId projectId
 * @param {Blob[]} blob blob
 * @return {Object} Return project information.
 */
function updateProjectByBlob(projectId, blob) {
    return new ProjectApp2().updateProjectByBlob(projectId, blob);
}

/**
 * Retrieve project as raw data (JSON).<br>
 * @param {String} projectId projectId
 * @return {Object} Return JSON
 */
function getProjectRaw(projectId) {
    return new ProjectApp2().getProjectRaw(projectId);
}

/**
 * Create new project by raw data (JSON).<br>
 * @param {String} projectname projectname
 * @param {Object} raw raw (JSON)
 * @param {String} parentId file ID of Google Docs. Create new project of bound script type by this. When this is not defined, new standalone project is created.
 * @return {Object} Return project information.
 */
function createProjectByRaw(projectname, raw, parentId) {
    return new ProjectApp2().createProjectByRaw(projectname, raw, (parentId || null));
}

/**
 * Update project by raw data (JSON).<br>
 * @param {String} projectId projectId
 * @param {Object} raw raw (JSON)
 * @return {Object} Return project information.
 */
function updateProjectByRaw(projectId, raw) {
    return new ProjectApp2().updateProjectByRaw(projectId, raw);
}
;
(function(r) {
  var ProjectApp2;
  ProjectApp2 = (function() {
    var createNewProject, createProject, dupCheck, fetch, getBlobProject, getProjectInf, getRawProject, makeProjectByBlob, mergeManifests, readBlob, readBlobs, scriptMerge, updateProject;

    ProjectApp2.name = "ProjectApp2";

    function ProjectApp2() {
      this.name = "ProjectApp2";
      this.baseurl = "https://script.googleapis.com/v1/projects/";
      this.accesstoken = ScriptApp.getOAuthToken();
    }

    ProjectApp2.prototype.getProjectInfo = function(fileId_, blob_) {
      return getProjectInf.call(this, fileId_);
    };

    ProjectApp2.prototype.getProjectBlob = function(fileId_, zip_) {
      return getBlobProject.call(this, fileId_, zip_);
    };

    ProjectApp2.prototype.getProjectRaw = function(fileId_) {
      return getRawProject.call(this, fileId_);
    };

    ProjectApp2.prototype.createProjectByBlob = function(projectname_, blob_, parentId_) {
      var source;
      if (projectname_ == null) {
        throw new Error("No projectname.");
      }
      if (blob_ != null) {
        source = makeProjectByBlob.call(this, blob_);
      }
      return createProject.call(this, projectname_, source, parentId_);
    };

    ProjectApp2.prototype.createProjectByRaw = function(projectname_, raw_, parentId_) {
      if (projectname_ == null) {
        throw new Error("No projectname.");
      }
      return createProject.call(this, projectname_, raw_, parentId_);
    };

    ProjectApp2.prototype.updateProjectByBlob = function(projectId_, blob_) {
      var project, source, uproject;
      if (projectId_ == null) {
        throw new Error("No project id.");
      }
      project = getRawProject.call(this, projectId_);
      source = makeProjectByBlob.call(this, blob_);
      uproject = scriptMerge.call(this, project, source, true);
      return updateProject.call(this, projectId_, uproject);
    };

    ProjectApp2.prototype.updateProjectByRaw = function(projectId_, raw_) {
      var raw;
      if (projectId_ == null) {
        throw new Error("No project id.");
      }
      if (raw_ == null) {
        throw new Error("No Project data as JSON.");
      }
      raw = mergeManifests.call(this, projectId_, raw_);
      return updateProject.call(this, projectId_, raw);
    };

    getBlobProject = function(fileId_, zip_) {
      var blobs, e, filename, j, len, project, ref, res, type;
      if (fileId_ == null) {
        throw new Error("No project ID.");
      }
      project = getRawProject.call(this, fileId_);
      blobs = [];
      ref = project.files;
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        type = e.type.toLowerCase();
        blobs.push(Utilities.newBlob(e.source, (type === "server_js" ? "text/plain" : type === "html" ? "text/html" : type === "json" ? "application/json" : null), e.name + (type === "server_js" ? ".gs" : type === "html" ? ".html" : type === "json" ? ".json" : null)));
      }
      if ((zip_ != null) || zip_) {
        res = getProjectInf.call(this, fileId_);
        filename = res.error == null ? res.name + '.zip' : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss") + '.zip';
        return [Utilities.zip(blobs, filename)];
      } else {
        return blobs;
      }
    };

    getRawProject = function(fileId_) {
      var res;
      if (fileId_ == null) {
        throw new Error("No project ID.");
      }
      res = fetch.call(this, this.baseurl + fileId_ + "/content", "get", null);
      if (res.error != null) {
        throw new Error(JSON.stringify(res));
      } else {
        return res;
      }
    };

    getProjectInf = function(fileId_) {
      var res;
      if (fileId_ == null) {
        throw new Error("No project ID.");
      }
      res = fetch.call(this, this.baseurl + fileId_, "get", null);
      if (res.error != null) {
        throw new Error(JSON.stringify(res));
      } else {
        return res;
      }
    };

    createProject = function(projectname_, source_, parentId_) {
      var res, src;
      res = createNewProject.call(this, projectname_, parentId_);
      if (source_ != null) {
        src = mergeManifests.call(this, res.scriptId, source_);
        return updateProject.call(this, res.scriptId, src);
      } else {
        return res;
      }
    };

    createNewProject = function(projectname_, parentId_) {
      var metadata, res;
      metadata = {
        title: projectname_
      };
      if (parentId_ != null) {
        metadata.parentId = parentId_;
      }
      res = fetch.call(this, this.baseurl.slice(0, -1), "post", JSON.stringify(metadata));
      if (res.error != null) {
        throw new Error(JSON.stringify(res));
      } else {
        return res;
      }
    };

    updateProject = function(projectId_, source_) {
      var res;
      res = fetch.call(this, this.baseurl + projectId_ + "/content", "put", JSON.stringify(source_));
      if (res.error != null) {
        throw new Error(JSON.stringify(res));
      } else {
        return res;
      }
    };

    mergeManifests = function(projectId, source) {
      var e, j, len, project, ref, s, tz;
      if (!(source.files.some(function(e) {
        return e.name === "appsscript";
      }))) {
        project = getRawProject.call(this, projectId);
        ref = project.files;
        for (j = 0, len = ref.length; j < len; j++) {
          e = ref[j];
          if (e.name === "appsscript") {
            s = JSON.parse(e.source);
            tz = Session.getScriptTimeZone();
            if (s.timeZone !== tz) {
              s.timeZone = tz;
              e.source = JSON.stringify(s, null, "  ");
            }
            source.files.push(e);
            return source;
          }
        }
      } else {
        return source;
      }
    };

    makeProjectByBlob = function(Blob_) {
      var res;
      if (Blob_ == null) {
        throw new Error("No Blobs.");
      }
      if (Array.isArray(Blob_)) {
        res = readBlobs.call(this, Blob_);
      } else {
        res = readBlob.call(this, Blob_);
      }
      return res;
    };

    readBlob = function(Blob_) {
      var blob, e, ext, filename, files, name, type;
      try {
        blob = Blob_;
        filename = blob.getName().length === 0 ? new Date().getTime().toString() : blob.getName();
        name = filename.split(".");
        ext = name[name.length - 1];
      } catch (error) {
        e = error;
        throw new Error("Wrong Blob. Please confirm inputted blob again. " + e);
      }
      type = "";
      switch (ext.toLowerCase()) {
        case "js" || "gs":
          type = "SERVER_JS";
          break;
        case "htm" || "html" || "css":
          type = "HTML";
          break;
        case "json":
          type = "JSON";
          break;
        default:
          type = "SERVER_JS";
      }
      files = {
        files: [
          {
            name: name[0],
            type: type,
            source: type === "" ? null : blob.getDataAsString()
          }
        ]
      };
      if (files.files[0].source == null) {
        return null;
      } else {
        return files;
      }
    };

    readBlobs = function(Blob_) {
      var b, file, files, j, len;
      files = [];
      for (j = 0, len = Blob_.length; j < len; j++) {
        b = Blob_[j];
        file = readBlob.call(this, b);
        if (file != null) {
          files.push(file.files[0]);
        }
      }
      return dupCheck.call(this, files);
    };

    dupCheck = function(files) {
      var e, i, j, len, tmp;
      tmp = {};
      for (i = j = 0, len = files.length; j < len; i = ++j) {
        e = files[i];
        if (tmp[e.name]) {
          tmp[e.name] += 1;
          files[i].name = files[i].name + "_" + tmp[e.name].toString();
        } else {
          tmp[e.name] = 1;
        }
      }
      if (files.length > 0) {
        return {
          files: files
        };
      } else {
        return null;
      }
    };

    scriptMerge = function(base, src, overwrite) {
      var e, f, h, i, j, k, len, len1, pos, ref, ref1;
      ref = base.files;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        e = ref[i];
        pos = null;
        ref1 = src.files;
        for (h = k = 0, len1 = ref1.length; k < len1; h = ++k) {
          f = ref1[h];
          if ((e.name === f.name) && (Object.keys(f).length > 0)) {
            pos = h;
            if (overwrite) {
              base.files[i].source = f.source;
            }
          }
        }
        if (pos != null) {
          src.files.splice(pos, 1);
        }
      }
      if (src.files.length > 0) {
        base.files = base.files.concat(src.files);
      }
      return base;
    };

    fetch = function(url, method, payload) {
      var e, headers, res;
      try {
        headers = {
          "User-Agent": "Mozilla/5.0 Firefox/26.0",
          "Authorization": "Bearer " + this.accesstoken
        };
        if (method === "post" || method === "put") {
          headers["Content-Type"] = "application/json";
        }
        res = UrlFetchApp.fetch(url, {
          method: method,
          payload: payload,
          headers: headers,
          muteHttpExceptions: true
        });
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      try {
        r = JSON.parse(res.getContentText());
      } catch (error) {
        e = error;
        r = res.getContentText();
      }
      return r;
    };

    return ProjectApp2;

  })();
  return r.ProjectApp2 = ProjectApp2;
})(this);
