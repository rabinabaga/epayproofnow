import { useBlockchainContext } from "./contractContext";

const AccountantAccess = () => {
  const { connectedUserDetails } = useBlockchainContext();
  return (
    <div>
      <h3>Accountant only area</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <td>{connectedUserDetails.fullName}</td>
        </tbody>
      </table>
    </div>
  );
};
export default AccountantAccess;
