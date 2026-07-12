#!/usr/bin/dotnet run
#:sdk Microsoft.NET.Sdk.Web

using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;

var fileProvider = args switch
{
    [var path] when Path.IsPathRooted(path) => new PhysicalFileProvider(path),
    [var path] => new PhysicalFileProvider(Path.Combine(Environment.CurrentDirectory, path)),
    [] => new PhysicalFileProvider(Environment.CurrentDirectory),
    _ => throw new ArgumentException("Usage: ./server.cs [path]")
};

var builder = WebApplication.CreateSlimBuilder();
builder.Logging.ClearProviders();
var app = builder.Build();

app.MapGet("{**directory:nonfile}", ctx =>
{
    var directory = ctx.Request.RouteValues["directory"] as string;
    var fileInfo = fileProvider.GetFileInfo(Path.Combine(directory ?? "", "index.html"));
    return FileOrNotFoundAsync(ctx, fileInfo);
});

app.MapGet("{**file}", ctx =>
{
    var file = ctx.Request.RouteValues["file"] as string;
    var fileInfo = fileProvider.GetFileInfo(file ?? "");
    return FileOrNotFoundAsync(ctx, fileInfo);
});

var server = app.RunAsync();
Console.WriteLine($"==> Serving at {app.Urls.First()} ({fileProvider.Root})");

await server;
return 0;

static Task FileOrNotFoundAsync(HttpContext ctx, IFileInfo file)
{
    if (file.Exists)
    {
        var contentTypeProvider = new FileExtensionContentTypeProvider();
        if (contentTypeProvider.TryGetContentType(file.Name, out var contentType))
        {
            ctx.Response.ContentType = contentType;
        }

        return ctx.Response.SendFileAsync(file, ctx.RequestAborted);
    }

    ctx.Response.StatusCode = 404;
    return Task.CompletedTask;

}
