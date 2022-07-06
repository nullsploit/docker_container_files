import React, { Component } from 'react';
// import Quill from 'quill';
// import MonacoEditor from 'react-monaco-editor';
// import { MonacoServices } from "monaco-languageclient";
import Editor from "@monaco-editor/react";
import { getExtensionLanguage } from './Vars';

class ContainerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directory: "",
      directory_items: [],
      container_name: "",
      container: {},
      code: "",
      language: "python",
      file: {
        "value": '{\n    "text": "Placeholder"\n}',
        "langage": 'json',
        "name": "test.json",
        "path": "--tst--",
      },
      openFiles: [],
      editorRef: null,
    }
  }

  componentDidMount() {
    var container_name = window.getContainerName();
    var container = window.getContainerObject();
    this.getDirectory(container_name, "/")
    .then(response => {
      this.setState({
        directory: "/",
        directory_items: response.items,
        container_name: container_name,
        container: container,
      });
    })
  }


  handleKeyDown = (event)=>{
    // event.preventDefault();
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();

      // console.log(this.state.editorRef.getValue());
      // check if file is open
      if(this.state.file.path != "--tst--") {
        this.writeFileContents(this.state.file.path, this.state.editorRef.getValue())
        .then(response => response.json())
        .then(json => {
          console.log(json);
        })
        .catch(error => {
          console.log(error);
        });
      }
      // alert("CTRL+S Pressed");
    }
    // else if((event.ctrlKey || event.metaKey) && charCode === 'c') {
    //   alert("CTRL+C Pressed");
    // }else if((event.ctrlKey || event.metaKey) && charCode === 'v') {
    //   alert("CTRL+V Pressed");
    // }
  }


  writeFileContents = (file_path, contents) => {
    
    return new Promise((resolve, reject) => {
      // var formData = new FormData();
      // formData.append("file_path", file_path);
      // formData.append("contents", contents);
      fetch(`/api/write_file_contents/${this.state.container_name}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_path: file_path,
          file_contents: contents,
        }),
        // body: formData,
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
    });
    // .then(response => {
    //   console.log(response);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  }


  getFileContents = (file_path) => {
    return new Promise((resolve, reject) => {
      var url = `/api/file_contents/${this.state.container_name}/?file_path=${file_path}`;
      fetch(url)
      .then(response => {
        return response.json();
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
    })
  }


  addFileToOpenFiles = (file) => {
    // check if file is already open
    var openFiles = this.state.openFiles;
    var newOpenFiles = [];
    var found = false;
    openFiles.map((openFile, index) => {
      if(openFile.path == file.path) {
        found = true;
      }
      newOpenFiles.push(openFile);
    });
    if(!found) {
      newOpenFiles.push(file);
    }
    this.setState({openFiles: newOpenFiles});
  }


  fileClick = (file_path) => {
    this.getFileContents(file_path)
    .then(response => {
      var file_extension = file_path.split(".").pop();
      var file_name = file_path.split("/").pop();
      var langage = getExtensionLanguage(file_extension);
      var selectedFile = {
        name: file_name,
        language: langage,
        value: response.contents,
        path: file_path
      }
      var newOpenFile = {
        path: file_path,
        name: file_name,
      }
      this.addFileToOpenFiles(newOpenFile);
      this.setState({file: selectedFile});
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  }

  removeOpenFile = (file_path) => {
    var openFiles = this.state.openFiles;
    var newOpenFiles = [];
    openFiles.map((openFile, index) => {
      if(openFile.path != file_path) {
        newOpenFiles.push(openFile);
      }
    });
    // check if any files are open
    if(newOpenFiles.length == 0) {
      var newFile = {
        "value": '{\n    "text": "Placeholder"\n}',
        "langage": 'json',
        "name": "test.json",
        "path": "--tst--",
      };
    }else{
      var newFile = newOpenFiles[0];
    }
    this.setState({openFiles: newOpenFiles, file: newFile});
  }

  editorOnChange(newValue, e) {
    // check if file is open
    if(this.state.file.path != "--tst--") {
      var file = this.state.file;
      file.value = newValue;
      this.setState({file: file});
    }
    // console.log('onChange', newValue, e);
  }


  directoryClick = (directory) => {
    if(directory.endsWith("/")) {
      // check if last character is ../
      if (directory.slice(-3) === "../") {
        // get the directory without the last ../
        var directory = directory.slice(0, -3);
        // split the directory by /
        var directory_array = directory.split("/");
        // remove empty strings from the array
        directory_array = directory_array.filter(function(el) {
          return el != "";
        });
        // remove the last element from the array
        directory_array.pop();
        // join the array back into a string
        directory = directory_array.join("/");
  
        // directory_array.pop();
        if(!directory.startsWith("/")) {
          directory = "/" + directory;
        }
        if(!directory.endsWith("/")) {
          directory = directory + "/";
        }
  
      }
      this.getDirectory(this.state.container_name, directory)
      .then(response => {
        this.setState({
          directory: directory,
          directory_items: response.items,
        })
      })
    }else{
      this.fileClick(directory);
    }
  }

  getDirectory = (container_name, directory) => {
    return new Promise((resolve, reject) => {
      fetch(`/api/get_directory/${container_name}/?dir=${directory}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      })
    })
  }

  render() {
    
    return (
        <>
        <div className='col-lg-6'>
          <div className='card'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-lg-6'>
                  <div>
                    <button onClick={() => {window.location.href="/"}} className='btn btn-sm btn-primary'><i className='fa fa-arrow-left'></i> Back</button>
                    <h4>{this.state.container_name}</h4>
                  </div>
                  <div>
                    {this.state.directory}
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div>
                    {
                    this.state.container.status == "running"?
                      <span><i className='fa fa-play text-success'></i> {this.state.container.status}</span>
                    :
                      <span><i className='fa fa-stop text-danger'></i> {this.state.container.status}</span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <table className='table table-sm table-striped'>
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Type</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.directory_items.map((item, index) => {
                      if(item != "./") {
                        var typeIcon = item.endsWith("/") ? "fa fa-folder" : "fa fa-file";
                        var typeName = item.endsWith("/") ? "Directory" : "File";

                        var item_new = item.split("|")[1];
                        var size = item.split("|")[0];
                        return(
                          <tr style={{cursor: 'pointer'}} key={index} onClick={() => {this.directoryClick(`${this.state.directory}${item_new}`)}}>
                            <td><i className={typeIcon}></i> {item_new}</td>
                            <td>{typeName}</td>  
                            <td>{size}</td>  
                          </tr>
                        )
                      }
                    })}
                </tbody>
              </table> 
            </div>  
          </div>
        </div>
        <div className='col-lg-6'>
          <div className='row'>
              {this.state.openFiles.map((file, index) => {
                var isSelected = this.state.file.path == file.path;
                var btnStyle = isSelected ? "btn-primary" : "btn-secondary";
                return (
                  <button className={`btn btn-sm ${btnStyle}`}>
                    <span onClick={() => {this.fileClick(file.path)}}>{file.name} </span>
                    <span onClick={() => {this.removeOpenFile(file.path)}} className='bg-danger pl-1 pr-1'>X</span>
                  </button>
                )
              })}
          </div>
          <div className='row' onKeyDown={this.handleKeyDown}>
            <Editor
              height="80vh"
              // theme="vs-dark"
              theme="vs"
              path={this.state.file.name}
              defaultLanguage={this.state.file.language}
              defaultValue={this.state.file.value}
              // onMount={(editor) => (editorRef.current = editor)}
              onMount={(editor) => {
                editor.current = editor;
                this.setState({editorRef: editor});
              }}
              // onChange={this.editorOnChange}
            />
          </div>

        </div>
        </>
    );
  }
};


export default ContainerApp;