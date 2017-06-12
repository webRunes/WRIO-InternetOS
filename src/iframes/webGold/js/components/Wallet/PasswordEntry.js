import React from 'react';

class PasswordEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passphrase: "",
            passphrase2: ""
        };

    }

    confirmPass() {
        const passphrase =  this.refs.passphrase.value;
        const passphrase2 = this.refs.passphrase2.value;

        if (passphrase !== passphrase2) {
            alert("Passwords don't match");
            return;
        }
        if (passphrase === "") {
            return alert("Password can't be blank!")
        }

        this.setState({
            verifyStage:true,
            passphrase: passphrase,
            passphrase2: passphrase2
        });

    }

    render() {
        return (
            <div>
                <div className="form-group form-inline">
                    <label for="id-Passphrase" className="col-sm-4 col-md-3 control-label">Create Password</label>
                    <div className="col-sm-8 col-md-9">
                        <input className="form-control" type="password" ref="passphrase" placeholder="Enter password" size="80"></input>
                    </div>
                </div>
                <div className="form-group form-inline">
                    <label for="id-Passphrase" className="col-sm-4 col-md-3 control-label">Repeat password</label>
                    <div className="col-sm-8 col-md-9">
                        <input className="form-control" type="password" ref="passphrase2" placeholder="Repeat password" size="80"></input>
                    </div>
                </div>
            </div>)
    }
}