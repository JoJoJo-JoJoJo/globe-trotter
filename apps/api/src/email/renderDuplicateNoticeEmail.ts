export default function renderDuplicateNoticeEmail(email) {
  return (
    `
    <h3>Someone tried to sign up with your email address - was this you?</h3>
    <p>We've just noticed an attempt to sign up to the account you already own with your email address. If this was not you, please click the button below to report this</p>
    <button>Report suspicious sign-up</button>
    <br>
    <h4>Globe Trotter</h4>
    <em style="font-size: 0.8rem">If this sign-up was you, ignore this email.</em>
    `
  )
}
