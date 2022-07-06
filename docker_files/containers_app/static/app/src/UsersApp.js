import React, { Component } from 'react';

class UsersApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      message: '',
      messageColorClass: '',
      addingUser: false,

      newUserPassword: '',
      newUserUsername: '',

      addingUserMessage: '',
      addingUserMessageColorClass: '',
    }
  }

  componentDidMount() {
    this.getUsers()
    .then(users => {
      this.setState({
        users: users.users,
      });
    }).catch(err => {
      console.log(err);
    })
  }

  getUsers = () => {
    return new Promise((resolve, reject) => {
      fetch("/api/users/", {
        method: "GET",
      })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      })
    });
  }

  selectUser = (user) => {
    this.setState({selectedUser: user});
  }


  setUserProperty = (event) => {
    const { name, value } = event.target;
    const user = this.state.selectedUser;
    user[name] = value;
    this.setState({selectedUser: user});
  }


  updateUser = () => {
    const { selectedUser } = this.state;
    fetch("/api/users/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedUser),
    })
    .then(response => response.json())
    .then(data => {
      if(data.status) {
        this.setState({
          message: data.message,
          messageColorClass: 'text-success',
        });
      }else{
        this.setState({
          message: data.message,
          messageColorClass: 'text-danger',
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  toggleAddingUser = () => {
    this.setState({
      addingUser: !this.state.addingUser,
      newUserUsername: '',
      newUserPassword: '',
    });
  }

  setNewUserProperty = (event) => {
    const { name, value } = event.target;
    this.setState({[name]: value});
  }

  deleteUser = (user_id) => {
    if(confirm("Are you sure you want to delete this user?")) {
      fetch("/api/users/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: user_id}),
      })
      .then(response => response.json())
      .then(data => {
        if(data.status) {
          this.setState({
            message: data.message,
            messageColorClass: 'text-success',
          });
          this.getUsers()
          .then(users => {
            this.setState({
              users: users.users,
            });
          }).catch(err => {
            console.log(err);
          })
        }else{
          this.setState({
            message: data.message,
            messageColorClass: 'text-danger',
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }

  addUser = () => {
    const { newUserUsername, newUserPassword } = this.state;
    fetch("/api/users/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUserUsername,
        password: newUserPassword,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if(data.status) {
        this.setState({
          message: data.message,
          messageColorClass: 'text-success',
        });
        this.getUsers()
        .then(users => {
          this.setState({
            users: users.users,
          });
          this.toggleAddingUser();
        }).catch(err => {
          console.log(err);
        })
      }else{
        this.setState({
          message: data.message,
          messageColorClass: 'text-danger',
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
  }


  render() {
    return (
      <div className='col-lg-12'>
        <h1>Users</h1>
        <p className={this.state.messageColorClass}>{this.state.message}</p>
        <div className='row'>
          <div className='col-lg-4'>
            {/* <div className='card'> */}
              {this.state.users.map((user, index) => {
                return (
                  <div key={index} className='card mb-2'>
                    <div className='row'>
                      <div style={{cursor: 'pointer'}} onClick={() => this.selectUser(user)} className='p-3 col-lg-10'>
                        <p className='m-0 p-0'>{user.username}</p>
                      </div>
                      <div onClick={() => this.selectUser(user)} className='col-lg-2 p-3'>
                        <button style={{float: 'right'}} className='btn btn-sm btn-danger' onClick={() => this.deleteUser(user.id)}>
                          <i className='fa fa-trash'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {this.state.addingUser?
                <div className='card'>
                  <div className='p-3'>
                    <div className='row'>
                      <div className='col-lg-6'>
                        <div className='form-group'>
                          <label>Username</label>
                          <input value={this.state.newUserUsername} name="newUserUsername" onInput={e => this.setNewUserProperty(e)} placeholder='Steve' type={"text"} className='form-control'/>
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <div className='form-group'>
                          <label>Password</label>
                          <input value={this.state.newUserPassword} name="newUserPassword" onInput={e => this.setNewUserProperty(e)} type={"password"} className='form-control'/>
                        </div>
                      </div>
                    </div>
                  </div>  
                  <div className='card-footer'>
                    <button onClick={() => this.toggleAddingUser()} className='btn btn-sm btn-danger float-right'>Cancel</button>
                    <button onClick={() => this.addUser()} className='btn btn-sm btn-success float-left'>Save</button>
                  </div>
                </div>
              :
                <div onClick={() => this.toggleAddingUser()} className='card' style={{cursor: 'pointer'}}>
                  <div className='p-3'>
                    <p className='m-0 p-0'><i className='fa fa-plus'></i> Add user</p>
                  </div>  
                </div>
              }
            {/* </div> */}
          </div>
          <div className='col-lg-8'>
            <div className='card'>

              {this.state.selectedUser ?
                <div className='row p-3'>
                  <div className='col-lg-4'>
                    <div className='form-group'>
                      <label htmlFor='username'>Username</label>
                      <input onChange={e => this.setUserProperty(e)} name="username" type='text' className='form-control' id='username' value={this.state.selectedUser.username} />
                      <button onClick={() => this.updateUser()} className='btn btn-sm btn-success mt-1'>Save</button>
                    </div>
                  </div>
                  <div className='col-lg-4'>
                    <div className='form-group'>
                      <label htmlFor='password1'>Password</label>
                      <input onChange={e => this.setUserProperty(e)} name="password" type='password' className='form-control' id='password1' value={this.state.selectedUser.password} />
                    </div>
                  </div>
                  <div className='col-lg-4'>
                    <div className='form-group'>
                      {/* active */}
                      <label htmlFor='active'>Active</label>
                      <select onChange={e => this.setUserProperty(e)} name='is_active' className='form-control' id='active'>
                        {this.state.selectedUser.is_active?
                          <>
                            <option selected={true} value={true}>Yes</option>
                            <option value={false}>No</option>
                          </>
                        :
                          <>
                            <option value={true}>Yes</option>
                            <option selected={true} value={false}>No</option>
                          </>
                        }
                      </select>
                    </div>
                  </div>
                </div>
              :
                <h4 className='p-4 m-0'>No user selected</h4>
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default UsersApp;