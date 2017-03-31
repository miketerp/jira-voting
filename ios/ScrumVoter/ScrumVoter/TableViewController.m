//
//  UIViewController+TableController.m
//  ScrumVoter
//
//  Created by Bane on 2017-03-30.
//  Copyright (c) 2017 GroupBy Inc. All rights reserved.
//

#import "TableViewController.h"
#import "VoteViewController.h"

@implementation TableViewController
{
    NSArray *tableData;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Initialize table data
    tableData = [NSArray arrayWithObjects:@"Searchendiser", @"SRE", @"Storefront", @"Wisdom", @"Shopping Cart", @"Services", nil];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [tableData count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *simpleTableIdentifier = @"SimpleTableItem";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    
    cell.textLabel.text = [tableData objectAtIndex:indexPath.row];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self performSegueWithIdentifier:@"voteTransition" sender:self];
    
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue
                 sender:(id)sender {
    //do nothing
}

@end
