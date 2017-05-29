import React from 'react';
import ReactDOM from 'react-dom';


export default class EmailEntry extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            email: "",
            emailCopy: "",
            emailInvalid: false,
            emailCopyInvalid: false,
            match: true
        };
        this.emailChange = this.emailChange.bind(this);
        this.emailCopyChange = this.emailCopyChange.bind(this);
    }

    validate(string) {
        let emailRegex = /.+@.+\..+/i;
        return string.match(emailRegex) === null;
    }

    compareEmails() {
        const match =  this.state.email === this.state.emailCopy;
        if (!match) {
            this.props.gotMail('Invalid email');
        }
        this.setState({ match : match });
        if (!this.state.emailInvalid && !this.state.emailCopyInvalid) {
            return this.props.gotMail(null, this.state.email);
        }
        this.props.gotMail('Invalid email');

    }

    emailChange(e) {
        let val = e.target.value;
        this.setState({
            email: val,
            emailInvalid: this.validate(val)
        }, ()=>this.compareEmails());

    }
    emailCopyChange(e) {
        let val = e.target.value;
        this.setState({
            emailCopy: val,
            emailCopyInvalid: this.validate(val)
        },() => this.compareEmails());

    }

    render() {
        const cls = (error) => "col-sm-8 col-md-9" + (error ? " has-error": "");

        return (
            <div className="form-conrol">
                    <label htmlFor="email" className="col-sm-4 col-md-3 control-label">Email</label>
                    <div className={cls(this.state.emailInvalid)}>
                        <input type="email" className="form-control" name="email" value={this.state.email} onChange={ this.emailChange } size="80" />
                        <div className="help-block">
                            {this.state.emailInvalid ? "Enter a valid email" : ""}
                        </div>
                    </div>
                <br />
                    <label htmlFor="emailcopy" className="col-sm-4 col-md-3 control-label">Repeat email</label>
                    <div className={cls(this.state.emailInvalid)}>
                        <input type="email" className="form-control" name="emailcopy" value={this.state.emailCopy} onChange={ this.emailCopyChange } size="80"/>
                        <div className="help-block">
                            {(this.state.match) ? "" : "Emails don't match"}
                        </div>
                    </div>
                <br />
               </div>

        );
    }
}
