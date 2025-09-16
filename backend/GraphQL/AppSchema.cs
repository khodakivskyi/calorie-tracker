using GraphQL.Types;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;

namespace backend.GraphQL
{
    public class AppSchema : Schema
    {
        public AppSchema(IServiceProvider provider) : base(provider)
        {
            Query = provider.GetRequiredService<RootQuery>();
            Mutation = provider.GetRequiredService<RootMutation>();
        }
    }
}
