import React, { Component } from 'react';

class UsersApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      message: '',
      messageColorClass: '',
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

  render() {
    return (
      <div className='col-lg-12'>
        <h1>Users</h1>
        <div className='row'>
          <div className='col-lg-4'>
            <div className='card'>
              {this.state.users.map((user, index) => {
                return (
                  <div onClick={() => this.selectUser(user)} className='p-3' key={index}>
                    <p className='m-0 p-0'>{user.username}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='col-lg-8'>
            <div className='card'>

              {this.state.selectedUser ?
                <div className='row p-3'>
                  <div className='col-lg-4'>
                    <div className='form-group'>
                      <label htmlFor='username'>Username</label>
                      <input onChange={e => this.setUserProperty(e)} name="username" type='text' className='form-control' id='username' value={this.state.selectedUser.username} />
                      <p className={this.state.messageColorClass}>{this.state.message}</p>
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