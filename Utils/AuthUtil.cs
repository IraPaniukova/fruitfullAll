namespace fruitfullServer.Utils;

public static class AuthUtil
{
    public static void EnsureOwnership(int resourceOwnerId, int loggedInUserId)
    {
        if (resourceOwnerId != loggedInUserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to modify this resource.");
        }
    }
}